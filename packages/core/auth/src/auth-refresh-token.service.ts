import { inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { XmCoreConfig } from '@xm-ngx/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';
import { REFRESH_TOKEN } from './xm-authentication-store.constants';

export const EXPIRES_DATE_FIELD = 'authenticationTokenexpiresDate';
export const DEFAULT_TIMEOUT = Math.pow(2, 31) - 1;

/**
 * Web Locks names used to coordinate token refresh across browser tabs.
 * - LEADER lock: held by a single "leader" tab that owns the proactive timer.
 * - SINGLE_FLIGHT lock: serializes the actual refresh network call so that
 *   simultaneous refreshes (e.g. many tabs hitting a 401) collapse into one.
 */
const REFRESH_LEADER_LOCK = 'xm_auth_refresh_leader';
const REFRESH_SINGLE_FLIGHT_LOCK = 'xm_auth_refresh_single_flight';

/**
 * Minimal typings for the Web Locks API so we don't depend on the DOM lib
 * shipping `navigator.locks` typings in every consumer's tsconfig.
 */
type LockGrantedCallback = () => Promise<unknown>;

interface WebLockManager {
    request(
        name: string,
        options: { mode?: 'exclusive' | 'shared' },
        callback: LockGrantedCallback,
    ): Promise<unknown>;
}

@Injectable()
export class AuthRefreshTokenService implements OnDestroy {

    private defaultTimeout: number = DEFAULT_TIMEOUT;
    private updateTokenTimer: any;

    private readonly coreConfig: XmCoreConfig = inject(XmCoreConfig);
    private readonly zone: NgZone = inject(NgZone);

    private latestCallback: (() => void) | null = null;
    private leadershipRequested: boolean = false;
    private isLeader: boolean = false;
    private releaseLeadership: (() => void) | null = null;

    constructor(
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService,
    ) {
    }

    public getExpirationTime(): number | null {
        return this.sessionStorage.retrieve(EXPIRES_DATE_FIELD)
            || this.localStorage.retrieve(EXPIRES_DATE_FIELD)
            || null;
    }

    public setExpirationTime(expirationTime: number, rememberMe: boolean = false): void {
        if (rememberMe) {
            this.localStorage.store(EXPIRES_DATE_FIELD, expirationTime);
        }
        this.sessionStorage.store(EXPIRES_DATE_FIELD, expirationTime);
    }

    public start(expiresIn: number | null, callback: () => void): void {
        if (this.isTabSyncEnabled()) {
            this.startWithTabSync(expiresIn, callback);
            return;
        }
        this.startLegacy(expiresIn, callback);
    }

    /**
     * Runs the given refresh operation as a cross-tab single-flight call.
     *
     * While one tab performs `operation`, other tabs wait on an exclusive lock.
     * When a waiting tab finally acquires the lock, if the stored expiration has
     * advanced in the meantime (another tab already refreshed), it runs `onSkip`
     * instead of hitting the network again - avoiding a stale-token refresh that
     * a single-session backend would reject.
     *
     * When tab sync is disabled (or the Web Locks API is unavailable) this simply
     * returns `operation()`, preserving the legacy behavior.
     */
    public runExclusive<T>(operation: () => Observable<T>, onSkip: () => Observable<T>): Observable<T> {
        const lockManager = this.getLockManager();
        if (!this.isTabSyncEnabled() || !lockManager) {
            return operation();
        }

        const expirationBefore = this.getExpirationTime();
        const request = lockManager.request(
            REFRESH_SINGLE_FLIGHT_LOCK,
            { mode: 'exclusive' },
            () => this.zone.run(() => {
                const expirationAfter = this.getExpirationTime();
                const peerRefreshed = !!expirationAfter
                    && (!expirationBefore || expirationAfter > expirationBefore);
                const source$ = peerRefreshed ? onSkip() : operation();
                return lastValueFrom(source$.pipe(defaultIfEmpty(undefined as T)));
            }),
        ) as Promise<T>;

        return from(request);
    }

    public isExpired(): boolean {
        const expirationTime = this.getExpirationTime();
        const currentDate = new Date().setSeconds(0);
        return currentDate > expirationTime;
    }

    public clear(): void {
        clearTimeout(this.updateTokenTimer);
        this.releaseLeadershipIfHeld();
        this.sessionStorage.clear(EXPIRES_DATE_FIELD);
        this.localStorage.clear(EXPIRES_DATE_FIELD);
    }

    public ngOnDestroy(): void {
        clearTimeout(this.updateTokenTimer);
        this.releaseLeadershipIfHeld();
    }

    private startLegacy(expiresIn: number | null, callback: () => void): void {
        let expirationTime: number;
        if (expiresIn) {
            expirationTime = new Date().setSeconds(expiresIn);
            this.setExpirationTime(expirationTime);
        } else {
            expirationTime = this.getExpirationTime();
        }

        const currentDate = new Date().setSeconds(0);
        if (currentDate < expirationTime) {
            let timeoutTime = (expirationTime - currentDate) - (60 * 1000);
            timeoutTime = this.updateTimoutToMaxValue(timeoutTime);
            this.updateTokenTimer = setTimeout(callback, timeoutTime);
        } else {
            callback();
        }
    }

    private startWithTabSync(expiresIn: number | null, callback: () => void): void {
        if (expiresIn) {
            const expirationTime = new Date().setSeconds(expiresIn);
            // Share the expiration through localStorage so a tab that is later
            // promoted to leader can schedule the timer from the same source.
            this.setExpirationTime(expirationTime, true);
        }

        this.latestCallback = callback;
        this.ensureLeadership();

        // Only the leader tab schedules the (single) proactive refresh timer.
        if (this.isLeader) {
            this.scheduleLeaderTimer();
        }
    }

    private ensureLeadership(): void {
        const lockManager = this.getLockManager();
        if (this.leadershipRequested || !lockManager) {
            return;
        }
        this.leadershipRequested = true;

        lockManager.request(
            REFRESH_LEADER_LOCK,
            { mode: 'exclusive' },
            () => this.zone.run(() => new Promise<void>((release) => {
                this.releaseLeadership = release;
                this.isLeader = true;
                this.scheduleLeaderTimer();
            })),
        ).catch(() => {
            // Lock request failed/aborted: allow a fresh election next time.
            this.isLeader = false;
            this.leadershipRequested = false;
            this.releaseLeadership = null;
        });
    }

    private scheduleLeaderTimer(): void {
        clearTimeout(this.updateTokenTimer);

        const expirationTime = this.getExpirationTime();
        if (!expirationTime) {
            return;
        }

        const currentDate = new Date().setSeconds(0);
        if (currentDate >= expirationTime) {
            this.fireCallback();
            return;
        }

        let timeoutTime = (expirationTime - currentDate) - (60 * 1000);
        timeoutTime = this.updateTimoutToMaxValue(Math.max(timeoutTime, 0));
        this.updateTokenTimer = setTimeout(() => this.zone.run(() => this.fireCallback()), timeoutTime);
    }

    private fireCallback(): void {
        if (this.latestCallback) {
            this.latestCallback();
        }
    }

    private releaseLeadershipIfHeld(): void {
        this.isLeader = false;
        this.leadershipRequested = false;
        if (this.releaseLeadership) {
            this.releaseLeadership();
            this.releaseLeadership = null;
        }
    }

    private isTabSyncEnabled(): boolean {
        // Cross-tab token propagation is intentionally limited to "remember me"
        // sessions (see ext ITSFSRE-12809). Coordinate refresh only in that case,
        // so non-remember-me sessions keep their independent per-tab behavior.
        return this.coreConfig?.SINGLE_SESSION_TAB_SYNC === true
            && this.isRememberMe()
            && !!this.getLockManager();
    }

    private isRememberMe(): boolean {
        return this.localStorage.retrieve(REFRESH_TOKEN) != null;
    }

    private getLockManager(): WebLockManager | null {
        if (typeof navigator === 'undefined') {
            return null;
        }
        const locks = (navigator as unknown as { locks?: WebLockManager }).locks;
        return locks || null;
    }

    private updateTimoutToMaxValue(timeout: number): number {
        if (timeout > this.defaultTimeout) {
            timeout = this.defaultTimeout;
        }
        return timeout;
    }
}
