import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Observable, filter, tap } from 'rxjs';
import { XmApplicationConfigService, XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import { VERSION } from '../xm.constants';
import { XmLoggerService } from '@xm-ngx/logger';
import { MenuService } from '@xm-ngx/components/menu';

export interface XmMainConfig extends XmUIConfig{
    fullWidth?: boolean;
}

interface XmNavbarConfig extends XmUIConfig {
    favicon: string;
}

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class XmMainComponent implements OnInit, AfterViewInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    public config: XmMainConfig = this.xmConfigService.getAppConfig();
    public isSidenavOpen$: Observable<boolean>;

    private uiConfigService = inject<XmUiConfigService<XmNavbarConfig>>(XmUiConfigService);

    constructor(
        private xmConfigService: XmApplicationConfigService<XmMainConfig>,
        private loggerService: XmLoggerService,
        private sessionService: XmSessionService,
        private menuService: MenuService,
    ) {
        const logger = this.loggerService.create({ name: 'XmMainComponent' });
        logger.info(`Application version. version="${VERSION}".`);
    }

    public ngOnInit(): void {
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );

        this.setFaviconfromConfig().pipe(takeUntilOnDestroy(this)).subscribe();
    }

    private setFaviconfromConfig(): Observable<XmNavbarConfig> {
        return this.uiConfigService.config$().pipe(
            filter<XmNavbarConfig>(Boolean),
            tap((config) => {
                document
                    ?.getElementById('favicon')
                    ?.setAttribute('href', config.favicon ? config.favicon : './assets/img/favicon.png');
            }),
        );
    }

    public ngAfterViewInit(): void {
        this.isSidenavOpen$ = this.menuService.isSidenavOpen;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
