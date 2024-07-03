import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter } from 'rxjs/operators';

interface XmNavbarConfig extends XmUIConfig {
    navbar: { layout: XmDynamicLayout[]; version: number };
}

enum XmNavbarConfigVersion {
    First = 1,
    Second = 2,
}

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    host: { class: 'xm-navbar' },
    templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {

    public XmNavbarConfigVersion: typeof XmNavbarConfigVersion = XmNavbarConfigVersion;
    public navbarLayout: XmDynamicLayout[];
    public navbarVersion: number;

    constructor(
        private uiConfigService: XmUiConfigService<XmNavbarConfig>,
    ) {
    }

    public ngOnInit(): void {
        this.uiConfigService.config$().pipe(
            takeUntilOnDestroy(this),
            filter<XmNavbarConfig>(Boolean),
        ).subscribe((config) => {
            this.navbarLayout = config.navbar && config.navbar.layout ? config.navbar.layout : null;
            this.navbarVersion = config.navbar && config.navbar.version ? config.navbar.version : XmNavbarConfigVersion.First;
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
