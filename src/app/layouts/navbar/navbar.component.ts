import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter } from 'rxjs/operators';

interface XmNavbarConfig {
    favicon: string;
    navbar: { layout: Layout[]; version: number };
}

enum XmNavbarConfigVersion {
    First = 1,
    Second = 2,
}

declare const $: any;

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {

    public XmNavbarConfigVersion: typeof XmNavbarConfigVersion = XmNavbarConfigVersion;
    public navbarLayout: Layout[];
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

            $('#favicon').attr('href', config.favicon ? config.favicon : './assets/img/favicon.png');
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
