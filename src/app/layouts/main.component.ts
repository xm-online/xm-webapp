import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {XmSessionService} from '@xm-ngx/core';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';
import {Observable} from 'rxjs';
import {XmApplicationConfigService, XmUIConfig} from '@xm-ngx/core/config';
import {VERSION} from '../xm.constants';
import {XmLoggerService} from '@xm-ngx/logger';
import {MenuService} from '@xm-ngx/components/menu';
import {MatSidenav} from '@angular/material/sidenav';
import {MenuCategory} from '@xm-ngx/components/menu';


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
    public menuCategories$: Observable<MenuCategory[]>;
    public isOldMenu: boolean;
    public isSidenavOpen$: Observable<boolean>;
    public initialSidenavOpenedState: boolean;
    @ViewChild('sidenav') public sidenav: MatSidenav;

    constructor(
        private xmConfigService: XmApplicationConfigService<XmMainConfig>,
        private loggerService: XmLoggerService,
        private sessionService: XmSessionService,
        private menuService: MenuService
    ) {
        const logger = this.loggerService.create({ name: 'XmMainComponent' });
        logger.info(`Application version. version="${VERSION}".`);
    }

    public ngOnInit(): void {
        this.observeIsOldMenu();
        this.menuCategories$ = this.menuService.menuCategories;
        this.initialSidenavOpenedState = this.menuService.initialSidenavOpenedState;
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );
    }

    public ngAfterViewInit(): void {
        this.menuService.sidenav = this.sidenav;
        this.isSidenavOpen$ = this.menuService.isSidenavOpen;
        this.observeSidenavConfiguration();
    }

    private observeSidenavConfiguration(): void {
        this.menuService.observeWindowSizeChange().pipe(takeUntilOnDestroy(this)).subscribe();
    }

    private observeIsOldMenu(): void {
        this.menuService.isOldMenu.pipe(takeUntilOnDestroy(this)).subscribe((isOldMenu: boolean) => this.isOldMenu = isOldMenu);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
