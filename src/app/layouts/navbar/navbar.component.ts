import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmUiConfigService } from '@xm-ngx/core';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter } from 'rxjs/operators';

interface Config {
    favicon: string;
    navbar: { layout: Layout[] };
}

declare const $: any;

@Component({
    selector: 'xm-navbar',
    styleUrls: ['./navbar.component.scss'],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {

    public navbarLayout: Layout[];

    constructor(
        private uiConfigService: XmUiConfigService<Config>,
    ) {
    }

    public ngOnInit(): void {
        this.uiConfigService.config$().pipe(
            takeUntilOnDestroy(this),
            filter<Config>(Boolean),
        ).subscribe((config) => {
            this.navbarLayout = config.navbar && config.navbar.layout ? config.navbar.layout : null;

            $('#favicon').attr('href', config.favicon ? config.favicon : './assets/img/favicon.png');
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
