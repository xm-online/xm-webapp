import { Directive, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { combineLatest } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

@Directive({
    selector: '[xmGuestBackground]',
    host: { class: 'xmGuestBackground' },
})
export class GuestBackgroundDirective implements OnInit, OnDestroy {

    @HostBinding('style.backgroundImage') public background: string;

    constructor(
        private sessionService: XmSessionService,
        private router: Router,
        private config: XmUiConfigService<{ loginScreenBg: string }>,
    ) {
    }

    public ngOnInit(): void {
        combineLatest([
            this.sessionService.isActive().pipe(startWith(false)),
            this.router.events.pipe(filter<Event>(e => e instanceof NavigationEnd)),
            this.config.config$(),
        ])
            .pipe(takeUntilOnDestroy(this))
            .subscribe(([active, event, config]) => {
                if (active) {
                    this.background = null;
                } else {
                    this.updateBackground(event as NavigationEnd, config);
                }
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private updateBackground(event: NavigationEnd, config: { loginScreenBg: string }): void {
        if (!config?.loginScreenBg) {
            return;
        }

        if (event.url === '/') {
            this.background = `url(${config.loginScreenBg})`;
        } else {
            this.background = null;
        }
    }
}
