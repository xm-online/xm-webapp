import { Injectable, OnDestroy } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { XmUser, XmUserService } from '@xm-ngx/core/user';
import { OnInitialize } from '@xm-ngx/shared/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Idle } from 'idlejs/dist';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LoginService, UserSessionService } from '../../shared/auth';

@Injectable({ providedIn: 'root' })
export class IdleLogoutService implements OnInitialize, OnDestroy {

    private idle: Idle;

    constructor(
        private router: Router,
        private sessionService: UserSessionService,
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
            const userAutoLogoutSeconds = user.autoLogoutTimeoutSeconds || null;
            if (userAutoLogoutEnabled && !isNaN(userAutoLogoutSeconds)) {
                this.start(userAutoLogoutSeconds);
            } else if (config?.idleLogout) {
                this.start(config.idleLogout);
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
        this.idle.stop();
        this.idle = null;
    }

}
