import { Directive, HostBinding } from '@angular/core';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive({
    selector: '[xmNavbarGuestBackground]',
    host: { class: 'xmNavbarGuestBackground' },
})
export class NavbarGuestBackgroundDirective {
    @HostBinding('class.xmGuestBackground-active') public background: boolean;

    constructor(
        private sessionService: XmSessionService,
        private config: XmUiConfigService<{ loginScreenBg: string }>,
    ) {
    }

    public ngOnInit(): void {
        combineLatest([
            this.sessionService.isActive().pipe(startWith(false)),
            this.config.config$(),
        ])
            .pipe(takeUntilOnDestroy(this))
            .subscribe(([a, c]) => this.background = !a && Boolean(c?.loginScreenBg));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
