import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuService } from '@xm-ngx/components/menu';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { XmApplicationConfigService, XmUIConfig } from '@xm-ngx/core/config';
import { XmLoggerService } from '@xm-ngx/logger';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Observable, Subscription } from 'rxjs';
import { VERSION } from '../xm.constants';

export interface XmMainConfig extends XmUIConfig {
    fullWidth?: boolean;
}

@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: false,
})
export class XmMainComponent implements OnInit, AfterViewInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    public config: XmMainConfig = this.xmConfigService.getAppConfig();
    public isSidenavOpen$: Observable<boolean>;
    public showSidebarBackdrop: boolean = false;
    public sidebarContentSpacer: string = '0';
    private rightSidebarSubscription: Subscription = Subscription.EMPTY;

    constructor(
        private xmConfigService: XmApplicationConfigService<XmMainConfig>,
        private loggerService: XmLoggerService,
        private sessionService: XmSessionService,
        private menuService: MenuService,
        private eventManager: XmEventManager,
    ) {
        const logger = this.loggerService.create({name: 'XmMainComponent'});
        logger.info(`Application version. version="${VERSION}".`);
    }

    public ngOnInit(): void {
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );

        this.rightSidebarSubscription = this.eventManager.subscribe('rightSidebarToggle', (res) => {
            this.showSidebarBackdrop = res.data?.mode === 'over' && res.data?.width !== '0';
            this.sidebarContentSpacer = res.data?.mode === 'side' ? res.data?.width || 0 : 0;
        });
    }

    public ngAfterViewInit(): void {
        this.isSidenavOpen$ = this.menuService.isSidenavOpen;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        this.rightSidebarSubscription.unsubscribe();
    }
}
