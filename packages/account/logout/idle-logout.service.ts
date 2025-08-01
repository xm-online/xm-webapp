import { inject, Injectable, NgZone } from '@angular/core';
import { XmEventManager, XmPublicUiConfigService, XmSessionService } from '@xm-ngx/core';
import { combineLatest, EMPTY, fromEvent, Observable, Subject, Subscription, switchMap, timer } from 'rxjs';
import { map, startWith, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
    XmIdleTime,
    XmIdleTimeBeforeLogoutRequest,
    XmIdleTimeConfig,
    XmIdleTimeSessionInfo,
} from './idle-logout.model';
import { OnInitialize } from '@xm-ngx/interfaces';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import { LoginService } from '@xm-ngx/components/login';

@Injectable({providedIn: 'root'})
export class IdleLogoutService implements OnInitialize {
    private readonly ACTIVITY_DETECTED_EVENT = 'ACTIVITY-DETECTED';
    private readonly sessionService: XmSessionService = inject(XmSessionService);
    private readonly eventManager: XmEventManager = inject(XmEventManager);
    private readonly userService: XmUserService = inject(XmUserService);
    private readonly loginService: LoginService = inject(LoginService);
    private readonly ngZone: NgZone = inject(NgZone);
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly document: Document = inject(DOCUMENT);
    private readonly publicUiConfigService: XmPublicUiConfigService<Partial<XmIdleTimeConfig>> = inject(XmPublicUiConfigService);
    private activityEvents: string[] = [
        'mousemove',
        'keydown',
        'mousedown',
        'touchstart',
        'scroll',
        'click',
    ];
    private idleChannel: BroadcastChannel = new BroadcastChannel('idle-logout');
    private activityDetected: Subject<void> = new Subject<void>();
    private activitySubscription: Subscription;

    /**
     * Initializes the idle session monitoring logic.
     * Sets up listeners for user activity and triggers logout or a pre-logout HTTP request
     * after a period of inactivity, based on configuration.
     *
     * - Uses `staticTimeout` for idle duration.
     * - Checks `checkIdleTime` to enable/disable idle monitoring.
     * - Optionally performs a HTTP request before logout (`httpRequestBeforeLogout`).
     * - Broadcasts activity events across browser tabs.
     */
    public init(): void {
        let staticTimeout: number;
        let doLogout: boolean;
        let httpRequestBeforeLogout: XmIdleTimeBeforeLogoutRequest;
        let activityEvents: string[];

        this.ngZone.runOutsideAngular(() => {
            this.setChannelListener();

            this.activitySubscription = this.isActiveSessionAndConfigs$.pipe(
                tap(({config, user}: XmIdleTimeSessionInfo) => {
                    const {idleTime} = config || {};

                    staticTimeout = this.getTimeout(config, user, idleTime);
                    doLogout = Boolean(config.idleLogout) || idleTime?.doLogout || false;
                    httpRequestBeforeLogout = idleTime?.httpRequestBeforeLogout || null;
                    activityEvents = idleTime?.activityEvents || this.activityEvents;
                }),
                switchMap(({isActiveSession}: XmIdleTimeSessionInfo) => this.activity$(isActiveSession, activityEvents)),
                tap(() => this.sendEventToChannel()),
                switchMap(() => timer(staticTimeout)),
                switchMap(() => this.doIdleAction(doLogout, httpRequestBeforeLogout)),
                takeUntil(fromEvent(window, 'beforeunload')),
            ).subscribe();
        });

    }

    private getTimeout(config: XmIdleTimeConfig, user: XmUser, idleTime: XmIdleTime): number {
        const {autoLogoutTimeoutSeconds} = user || {};
        const {staticTimeout} = idleTime || {};
        const oldIdleLogout: number = config?.idleLogout || null;
        const defaultTimeout = 1800; // Default to 30 minutes
        const actualTimeoutInSeconds: number = autoLogoutTimeoutSeconds || oldIdleLogout || staticTimeout || defaultTimeout;

        return actualTimeoutInSeconds * 1000;
    }

    private setChannelListener(): void {
        this.idleChannel.onmessage = (event: MessageEvent) => {
            const {type} = event.data || {};
            const isActivityDetected: boolean = type === this.ACTIVITY_DETECTED_EVENT;
            isActivityDetected && this.isDocumentVisibilityStateIs('hidden') && this.activityDetected.next();

        };
    }

    private sendEventToChannel(): void {
        this.isDocumentVisibilityStateIs('visible') && this.idleChannel.postMessage({type: this.ACTIVITY_DETECTED_EVENT});
    }

    private isDocumentVisibilityStateIs(state: 'hidden' | 'visible'): boolean {
        return this.document.visibilityState === state;
    }

    private get isActiveSessionAndConfigs$(): Observable<XmIdleTimeSessionInfo> {
        const activeSession$: Observable<boolean> = this.sessionService.isActive();

        return activeSession$.pipe(
            switchMap((isActiveSession: boolean) => this.mapActiveSessionAndConfigs$(isActiveSession)),
            tap(({config, user}: XmIdleTimeSessionInfo) => {
                const shouldCloseSubscription = !Boolean(config?.idleTime?.checkIdleTime || config?.idleLogout || user.autoLogoutTimeoutSeconds);
                if (shouldCloseSubscription) {
                    /** Close the subscription if idle time check is not specified */
                    this.activitySubscription && !this.activitySubscription.closed && this.activitySubscription.unsubscribe();
                }
            }),
        );
    }

    private mapActiveSessionAndConfigs$(isActiveSession: boolean): Observable<XmIdleTimeSessionInfo> {
        const configs$ = combineLatest([
            this.publicUiConfigService.config$(),
            this.userService.user$(),
        ]);

        return configs$.pipe(map(([config, user]: [XmIdleTimeConfig, XmUser]) => {
            return {
                isActiveSession,
                config,
                user,
            };
        }));
    }

    private activity$(isActiveSession: boolean, activityEvents: string[]): Observable<any> {
        if (!isActiveSession) {
            return EMPTY;
        }

        return new Observable(observer => {
            this.ngZone.runOutsideAngular(() => {
                const eventSubs: Subscription[] = activityEvents.map(e =>
                    fromEvent(document, e).subscribe(event => {
                        this.ngZone.runOutsideAngular(() => observer.next(event));
                    }),
                );
                const activityDetectedSub: Subscription = this.activityDetected.pipe(startWith(null)).subscribe(event => {
                    this.ngZone.runOutsideAngular(() => observer.next(event));
                });
                return () => {
                    eventSubs.forEach(sub => sub.unsubscribe());
                    activityDetectedSub.unsubscribe();
                };
            });
        }).pipe(throttleTime(1000));
    }

    private doIdleAction(doLogout: boolean, httpRequestBeforeLogout: XmIdleTimeBeforeLogoutRequest): Observable<unknown> {
        this.eventManager.broadcast({name: 'MAX-IDLE-TIME'});
        if (httpRequestBeforeLogout) {
            return this.fetchBeforeLogoutRequest(doLogout, httpRequestBeforeLogout);
        }

        this.logout(doLogout);
        return EMPTY;
    }

    private fetchBeforeLogoutRequest(doLogout: boolean, httpRequestBeforeLogout: XmIdleTimeBeforeLogoutRequest): Observable<unknown> {
        const {method, url} = httpRequestBeforeLogout;
        return this.httpClient.request(method, url).pipe(
            tap(() => this.logout(doLogout)),
            take(1),
        );
    }

    private logout(doLogout: boolean): void {
        if (doLogout) {
            this.ngZone.run(() => {
                this.loginService.logout();
            });
        }
    }
}
