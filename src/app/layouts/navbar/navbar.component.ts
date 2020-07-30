import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmSessionService, XmUiConfigService } from '@xm-ngx/core';
import { Layout } from '@xm-ngx/dynamic';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable } from 'rxjs';
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
    public isSessionActive$: Observable<boolean> = this.xmSessionService.isActive();

    constructor(
        private xmSessionService: XmSessionService,
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

    public isNotMobileMenu(): boolean {
        return $(window).width() > 991;
    }

}
