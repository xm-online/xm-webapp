import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { XmSessionService } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Observable } from 'rxjs';
import { XmApplicationConfigService, XmUIConfig } from '@xm-ngx/core/config';
import { VERSION } from '../xm.constants';
import { XmLoggerService } from '@xm-ngx/logger';
import { MenuService } from '@xm-ngx/components/menu';


export interface XmMainConfig extends XmUIConfig{
    fullWidth?: boolean;
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
    }

    public ngAfterViewInit(): void {
        this.isSidenavOpen$ = this.menuService.isSidenavOpen;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
