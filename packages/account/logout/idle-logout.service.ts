import { Injectable, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import { OnInitialize } from '@xm-ngx/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Idle } from 'idlejs/dist';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoginService } from '@xm-ngx/components/login';

@Injectable({ providedIn: 'root' })
export class IdleLogoutService implements OnInitialize, OnDestroy {

    private idle: Idle;

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
        ).subscribe(([active, user, config]) => this.initIdleLogout(active, user, config));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private initIdleLogout(active: boolean, user: XmUser, config: { idleLogout: number }): void {
        if (this.idle) {
            this.stop();
        }

        if (active && user) {
            const userAutoLogoutEnabled = user.autoLogoutEnabled || false;
            const userAutoLogoutSeconds = user.autoLogoutTimeoutSeconds || config?.idleLogout || null;
            if (userAutoLogoutEnabled && userAutoLogoutSeconds && !isNaN(userAutoLogoutSeconds)) {
                this.start(userAutoLogoutSeconds);
            }
        }
    }

    private start(time: number): void {
        this.idle = new Idle()
            .whenNotInteractive()
            .within(time, 1000)
            .do(() => {
                this.loginService.logout();
                this.stop();
            })
            .start();
    }

    private stop(): void {
        this.idle?.stop();
        this.idle = null;
    }

}
