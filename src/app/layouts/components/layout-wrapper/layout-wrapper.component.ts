import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MenuCategoriesComponent, MenuCategory, MenuService } from '@xm-ngx/components/menu';
import { combineLatest, from, Observable, of, switchMap } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmSidebarModule } from '@xm-ngx/components/sidebar';
import { XmEventManager, XmSessionService } from '@xm-ngx/core';
import { XmDynamicLayout, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';

interface XmMainConfig extends XmUIConfig {
    main: { layout: XmDynamicLayout[] };
    sidebar: { hidden: boolean };
}

@Component({
    selector: 'xm-layout-wrapper',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MenuCategoriesComponent,
        XmSidebarModule,
        XmDynamicModule,
    ],
    templateUrl: './layout-wrapper.component.html',
    styleUrl: './layout-wrapper.component.scss',
})
export class LayoutWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
    private menuService: MenuService = inject(MenuService);
    private eventManager: XmEventManager = inject(XmEventManager);
    private sessionService: XmSessionService = inject(XmSessionService);
    private uiConfigService: XmUiConfigService<XmMainConfig> = inject(XmUiConfigService);

    @Input() public isGuestLayout: boolean;
    public isMaterial3Menu: boolean;
    public isMobileScreen: boolean;
    public menuCategories$: Observable<MenuCategory[]>;
    public mainLayout: XmDynamicLayout[];
    public isSidebarHidden: boolean;

    @ViewChild('sidenav') public sidenav: MatSidenav;

    public ngOnInit(): void {
        this.observeLogoutEvent();
        this.observeIsMaterial3Menu();
        this.observeIsMobileScreen();
        this.menuCategories$ = this.menuService.menuCategories;

        this.uiConfigService.config$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((config) => {
            this.mainLayout = config.main?.layout || null;
            this.isSidebarHidden = config.sidebar?.hidden || false;
        });
    }

    public ngAfterViewInit(): void {
        this.menuService.sidenav = this.sidenav;
        this.observeShouldOpenSidenavAfterSignIn();
        this.observeSidenavConfiguration();
        this.observeSidenavOpenedChange();
    }

    private observeLogoutEvent(): void {
        this.eventManager.listenTo('USER-LOGOUT')
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.menuService.sidenav.close();
                this.menuService.setMenuCategories([]);
            });
    }

    private observeIsMobileScreen(): void {
        this.menuService.isMobileView
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isMobileScreen: boolean) => this.isMobileScreen = isMobileScreen);
    }

    private observeSidenavConfiguration(): void {
        this.menuService.observeWindowSizeChange().pipe(takeUntilOnDestroy(this)).subscribe();
    }

    private observeIsMaterial3Menu(): void {
        this.menuService.isMaterial3Menu
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isMaterial3Menu: boolean) => this.isMaterial3Menu = isMaterial3Menu);
    }

    private observeShouldOpenSidenavAfterSignIn(): void {
        combineLatest([this.sessionService.isActive(), this.menuService.isMobileView, this.menuService.isMaterial3Menu])
            .pipe(
                switchMap(([isActive, isMobileScreen, isMaterial3Menu]: [boolean, boolean, boolean]) => {
                    const notMaterial3Menu = isMaterial3Menu !== null && !isMaterial3Menu;
                    const shouldOpenMenu: boolean = notMaterial3Menu && isActive && !isMobileScreen && !this.menuService.sidenav.opened;
                    return shouldOpenMenu ? from(this.menuService.sidenav.open()) : of(null);
                }),
                takeUntilOnDestroy(this),
            )
            .subscribe();
    }

    private observeSidenavOpenedChange(): void {
        this.menuService.sidenav.openedChange.asObservable()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isOpened: boolean) => this.menuService.setSidenavOpenedChange(isOpened));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
