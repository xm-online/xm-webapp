import { inject, Injectable, NgZone } from '@angular/core';
import { XmEventManager, XmPublicUiConfigService, XmSessionService } from '@xm-ngx/core';
import { Router } from '@angular/router';
import { EMPTY, fromEvent, merge, Observable, Subject, switchMap, timer } from 'rxjs';
import { filter, startWith, take, takeUntil, tap, throttleTime, withLatestFrom } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { XmIdleTime, XmIdleTimeBeforeLogoutRequest } from './xm-idle.model';

@Injectable({providedIn: 'root'})
export class XmIdleService {
    private readonly ACTIVITY_DETECTED_EVENT = 'ACTIVITY-DETECTED';
    private readonly sessionService: XmSessionService = inject(XmSessionService);
    private readonly eventManager: XmEventManager = inject(XmEventManager);
    private readonly router: Router = inject(Router);
    private readonly ngZone: NgZone = inject(NgZone);
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly document: Document = inject(DOCUMENT);
    private readonly publicUiConfigService: XmPublicUiConfigService = inject(XmPublicUiConfigService);
    private activityEvents: string[] = [
        'mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll',
    ];
    private idleChannel: BroadcastChannel = new BroadcastChannel('idle-logout');
    private activityDetected: Subject<void> = new Subject<void>();

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

            this.isActiveSessionAndConfig$.pipe(
                tap(([, config]: [boolean, Record<string, any>]) => {
                    const idleTimeConfig: XmIdleTime = config?.idleTime || {};
                    staticTimeout = (idleTimeConfig?.staticTimeout || 30) * 60 * 1000;
                    doLogout = idleTimeConfig?.doLogout || false;
                    httpRequestBeforeLogout = idleTimeConfig?.httpRequestBeforeLogout || null;
                    activityEvents = idleTimeConfig?.activityEvents || this.activityEvents;
                }),
                switchMap(([isActiveSession]: [boolean, Record<string, any>]) => this.activity$(isActiveSession, activityEvents)),
                tap(() => this.sendEventToChannel()),
                switchMap(() => timer(staticTimeout)),
                switchMap(() => this.doIdleAction(doLogout, httpRequestBeforeLogout)),
                takeUntil(fromEvent(window, 'beforeunload')),
            ).subscribe();
        });
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

    private get isActiveSessionAndConfig$(): Observable<[boolean, Record<string, any>]> {
        const activeSession$: Observable<[boolean, Record<string, any>]> =
            this.sessionService.isActive().pipe(withLatestFrom(this.publicUiConfigService.config$()));
        return activeSession$.pipe(
            filter(([, config]: [boolean, Record<string, any>]) => Boolean(config?.idleTime?.checkIdleTime)),
        );
    }

    private activity$(isActiveSession: boolean, activityEvents: string[]): Observable<any> {
        if (!isActiveSession) {
            return EMPTY;
        }

        return merge(
            ...activityEvents.map(e => fromEvent(document, e)),
            this.activityDetected.pipe(startWith(null)),
        ).pipe(throttleTime(1000));
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
                this.sessionService.clear();
                this.router.navigate(['/']);
            });
        }
    }
}
