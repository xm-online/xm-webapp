import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter } from 'rxjs/operators';

interface XmNavbarConfig extends XmUIConfig {
    favicon: string;
    navbar: {
        layout: XmDynamicLayout[];
        version: number;
        config?: {
            logoDisabled?: boolean;
            arrowBackDisabled?: boolean;
            titleDisabled?: boolean;
            searchDisabled?: boolean;
            notificationDisabled?: boolean;
            helpLinkDisabled?: boolean;
            languageMenuDisabled?: boolean;
        }
    };
}

enum XmNavbarConfigVersion {
    First = 1,
    Second = 2,
}

declare const $: any;

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    host: {class: 'xm-navbar'},
    templateUrl: './navbar.component.html',
    standalone: false,
})
export class NavbarComponent implements OnInit, OnDestroy {

    public XmNavbarConfigVersion: typeof XmNavbarConfigVersion = XmNavbarConfigVersion;
    public navbarLayout: XmDynamicLayout[];
    public navbarVersion: number;
    public navbarConfig: any;

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
            this.navbarConfig = config.navbar?.config || {};

            $('#favicon').attr('href', config.favicon ? config.favicon : './assets/img/favicon.png');
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
