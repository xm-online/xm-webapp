import { Injectable, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmUserService } from '@xm-ngx/core/user';
import { OnInitialize } from '@xm-ngx/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoginService } from '@xm-ngx/components/login';

@Injectable({ providedIn: 'root' })
export class IdleLogoutService implements OnInitialize, OnDestroy {
    private interactionEvents = [
        'click',
        'mousemove',
        'mouseenter',
        'keydown',
        'scroll',
        'touchstart',
    ];
    private activeIntervalId: number;

    private autoLogoutSeconds = 0;

    constructor(
        private router: Router,
        private sessionService: XmSessionService,
        private userService: XmUserService,
        private loginService: LoginService,
        private configService: XmUiConfigService<{ idleLogout: number }>,
    ) {
    }

    public init(): void {
        combineLatest([
            this.sessionService.isActive(),
            this.userService.user$(),
            this.configService.config$(),
            this.router.events.pipe(filter<Event>(e => e instanceof NavigationEnd)),
        ]).pipe(
            takeUntilOnDestroy(this),
        ).subscribe(([active, user, config]) => {
            if (this.activeIntervalId) {
                this.removeInteractions();
            }

            if (active && user) {
                const userAutoLogoutEnabled = user.autoLogoutEnabled || false;
                const userAutoLogoutSeconds = user.autoLogoutTimeoutSeconds || config?.idleLogout || null;

                if (userAutoLogoutEnabled && userAutoLogoutSeconds && !isNaN(userAutoLogoutSeconds)) {
                    this.autoLogoutSeconds = userAutoLogoutSeconds;

                    this.listenInteractions();
                }
            }
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private createInteraction = () => {
        this.clearInterval();
        this.setInterval();
    };

    private listenInteractions(): void {
        for (const event of this.interactionEvents) {
            document.addEventListener(event, this.createInteraction);
        }

        this.setInterval();
    }

    private removeInteractions(): void {
        for (const event of this.interactionEvents) {
            document.removeEventListener(event, this.createInteraction);
        }

        this.clearInterval();

        this.activeIntervalId = null;
    }

    private setInterval(): void {
        this.activeIntervalId = window.setInterval(() => {
            this.loginService.logout();
            this.removeInteractions();
        }, this.autoLogoutSeconds * 1000);
    }

    private clearInterval(): void {
        window.clearInterval(this.activeIntervalId);
    }
}
