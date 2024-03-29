import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MenuCategoriesComponent, MenuCategory, MenuService } from '@xm-ngx/components/menu';
import { Observable } from 'rxjs';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmSidebarModule } from '@xm-ngx/components/sidebar';
import { XmEventManager } from '@xm-ngx/core';

@Component({
    selector: 'xm-layout-wrapper',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MenuCategoriesComponent,
        XmSidebarModule,
    ],
    templateUrl: './layout-wrapper.component.html',
    styleUrl: './layout-wrapper.component.scss',
})
export class LayoutWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() public isGuestLayout: boolean;
    public isMaterial3Menu: boolean;
    public initialSidenavOpenedState: boolean;
    public isMobileScreen: boolean;
    public menuCategories$: Observable<MenuCategory[]>;

    @ViewChild('sidenav') public sidenav: MatSidenav;

    constructor(
        private menuService: MenuService,
        private eventManager: XmEventManager
    ) {
    }

    public ngOnInit(): void {
        this.observeLogoutEvent();
        this.observeIsMaterial3Menu();
        this.observeIsMobileScreen();
        this.menuCategories$ = this.menuService.menuCategories;
        this.initialSidenavOpenedState = this.menuService.initialSidenavOpenedState;
    }

    public ngAfterViewInit(): void {
        this.menuService.sidenav = this.sidenav;
        this.observeSidenavConfiguration();
    }

    private observeLogoutEvent(): void {
        this.eventManager.listenTo('USER-LOGOUT')
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.menuService.sidenav.close());
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
