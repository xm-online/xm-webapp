import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { XmCoreConfig, XmSessionService } from '@xm-ngx/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';

import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/** TODO: Migrate to widgets. */
export interface NavbarLogoUIConfig extends XmUIConfig {
    name: string;
    logoUrl: string;
}

@Component({
    selector: 'xm-navbar-logo-widget',
    template: `
        <div class="xm-nav-logo" *ngIf="showLogo">
            <a [routerLink]="(isSessionActive$ | async) ? '/dashboard' : '/'"
               class="row flex-nowrap no-gutters align-items-center">
                <span *ngIf="tenantLogoUrl" class="col"><img class="logo-img" [src]="tenantLogoUrl" [alt]="tenantName"/></span>
                <span class="col-auto"><h5 class="logo-text d-none d-md-inline mx-2 my-0">{{tenantName}}</h5></span>
            </a>
        </div>
    `,
    imports: [
        RouterModule,
        CommonModule,
    ],
    standalone: true,
    styleUrls: ['./xm-navbar-logo-widget.component.scss'],
})
export class XmNavbarLogoWidget implements OnInit, OnDestroy, XmDynamicWidget {

    @Input() public config: NavbarLogoUIConfig;

    public tenantLogoUrl: string = '../assets/img/logo-xm-online.png';
    public tenantName: string;
    public showLogo: boolean = false;
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();
    private version: string;

    constructor(
        private xmUiConfigService: XmUiConfigService<NavbarLogoUIConfig>,
        private xmSessionService: XmSessionService,
        private xmCoreConfig: XmCoreConfig,
    ) {
    }

    public ngOnDestroy(): void {
        this.version = this.xmCoreConfig.IS_PRODUCTION ? `v${this.xmCoreConfig.VERSION}` : '';
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

            if (config.showLogo !== false) {
                this.showLogo = true;
            }
        });
    }
}
