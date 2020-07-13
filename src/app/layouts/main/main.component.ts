import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { Principal } from '@xm-ngx/core/auth';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { XmApplicationConfigService } from '../../shared/spec';
import { XM_EVENT_LIST } from '../../xm.constants';

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class XmMainComponent implements OnInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;

    constructor(
        private xmConfigService: XmApplicationConfigService,
        private sessionService: XmSessionService,
        private principal: Principal,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        this.sessionService.isActive().subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = false,
        );
        this.registerAuthenticationSuccess();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private registerAuthenticationSuccess(): void {
        this.eventManager.listenTo(XM_EVENT_LIST.XM_SUCCESS_AUTH)
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.principal.identity();
                this.isGuestLayout = false;
            });
    }
}
