import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { environment } from '@xm-ngx/core/environment';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DEBUG_INFO_ENABLED } from '../../xm.constants';

@Component({
    selector: 'xm-navbar-logo-component',
    template: `
        <div class="xm-nav-logo">
            <a [routerLink]="(isSessionActive$ | async) ? '/dashboard' : '/'"
               class="row flex-nowrap no-gutters align-items-center">
                <span *ngIf="tenantLogoUrl" class="col"><img [src]="tenantLogoUrl" [alt]="tenantName"/></span>
                <span class="col-auto"><strong class="logo-text">{{tenantName}}</strong></span>
            </a>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class XmNavbarLogoComponent implements OnInit, OnDestroy {
    public tenantLogoUrl: string = '../assets/img/logo-xm-online.png';
    public tenantName: string;
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    private version: string;

    constructor(
        private xmUiConfigService: XmUiConfigService,
        private xmSessionService: XmSessionService,
    ) {
    }

    public ngOnDestroy(): void {
        this.version = DEBUG_INFO_ENABLED ? `v${environment.version}` : '';
        takeUntilOnDestroyDestroy(this);
    }

    public ngOnInit(): void {
        this.xmUiConfigService.config$().pipe(
            filter((i) => Boolean(i)),
            takeUntilOnDestroy(this),
        ).subscribe((config) => {
            this.tenantName = config.name ? config.name : `XM^online ${this.version}`;

            if (config.logoUrl) {
                this.tenantLogoUrl = config.logoUrl;
            }
        });
    }
}
