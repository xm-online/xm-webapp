import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { XmEntitySpecWrapperService } from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import {
    animationFrameScheduler,
    combineLatest,
    debounceTime,
    from,
    fromEvent,
    merge,
    Observable,
    observeOn,
    of,
    tap,
    timer,
} from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';

import { ContextService } from '@xm-ngx/core/context';
import { Principal, XmUserService } from '@xm-ngx/core/user';
import { getDefaultMenuList } from './default-menu-list';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy, treeNodeSearch } from '@xm-ngx/operators';
import { applicationsToCategory } from './flat-menu';
import { HoveredMenuCategory, MenuCategory, MenuItem, MenuOptions, MobileMenuState } from './menu.interface';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Translate, XmTranslateService, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule, DOCUMENT } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmEventManager, XmEventManagerAction } from '@xm-ngx/core';
import { hideCategories, showHideSubCategoriesDesktop, showHideSubCategoriesMobile } from './menu.animation';
import { MenuService } from './menu.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MenuPositionEnum, MenuSubcategoriesAnimationStateEnum } from './menu.model';
import { MenuCategoriesComponent } from './menu-categories/menu-categories.component';
import { MatRipple } from '@angular/material/core';
import { SwitchThemeOptions, SwitchThemeWidgetModule } from '@xm-ngx/components/switch-theme-widget';

export type ISideBarConfig = {
    sidebar?: {
        hideAdminConsole?: boolean;
        hideApplication?: boolean;
        applicationTitle?: Translate;
        applicationIcon?: string;
        applicationPosition?: number;
    }
};

@Component({
    selector: 'xm-menu',
    templateUrl: './menu.component.html',
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
        showHideSubCategoriesDesktop,
        showHideSubCategoriesMobile,
        hideCategories,
    ],
    host: {
        class: 'xm-menu',
    },
    imports: [
        RouterModule,
        MatIconModule,
        MatButtonModule,
        XmTranslationModule,
        CommonModule,
        CdkTreeModule,
        XmPermissionModule,
        MenuCategoriesComponent,
        MatRipple,
        SwitchThemeWidgetModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
    private _config: MenuOptions;
    private previousActiveNode: MenuItem;
    public themeButtonConfig: WritableSignal<SwitchThemeOptions> = signal(null);

    @Input() set config(value: MenuOptions | null) {
        this._config = _.defaultsDeep(value, {
            'mode': 'toggle',
        });
        this.menuService.categories = value.categories;
        this.menuService.setMenuConfig(value);
        this.themeButtonConfig.set(value.themeButton);
        this.menuService.mobileMenuPositioning = value.mobileMenuPositioning || MenuPositionEnum.END;
    }

    get config(): MenuOptions {
        return this._config;
    }

    public treeControl = new NestedTreeControl<MenuItem>(node => node.children);
    public categories: MenuCategory[] = [];
    public subCategories$: Observable<MenuItem[]>;
    public menuByCategories: Record<string, MenuItem[]>;
    public filteredCategories: MenuItem[] = [];
    public showSubCategoriesState: string = MenuSubcategoriesAnimationStateEnum.HIDE;
    public selectedCategory: MenuCategory;
    public hoveredCategory: MenuCategory;
    public parentCategory: MenuItem;
    public isMaterial3Menu: boolean;
    public showMenuTree: boolean = true;
    public isMobileScreen: boolean;
    public mobileMenuState: MobileMenuState;
    public menuSubcategoriesAnimationStateEnum: typeof MenuSubcategoriesAnimationStateEnum = MenuSubcategoriesAnimationStateEnum;
    @ViewChild('menuView', {static: true}) private menuView: ElementRef;
    private ngZone: NgZone = inject(NgZone);

    constructor(
        protected readonly dashboardService: DashboardStore,
        protected readonly router: Router,
        protected readonly principal: Principal,
        protected readonly translate: XmTranslateService,
        protected readonly uiConfigService: XmUiConfigService<ISideBarConfig>,
        protected readonly entityConfigService: XmEntitySpecWrapperService,
        protected readonly contextService: ContextService,
        protected readonly userService: XmUserService,
        protected readonly eventManager: XmEventManager,
        protected readonly menuService: MenuService,
        @Inject(DOCUMENT) private document: Document,
    ) {
    }

    public hasChild = (_: number, node: MenuItem): boolean => {
        if (node?.category && !node.category.isLinkWithoutSubcategories) {
            return true;
        }
        return node.isLink == null ? (!!node.children && node.children.length > 0) : !node.isLink;
    };

    public ngOnInit(): void {
        this.observeSectionsFiltering();
        this.assignSubCategories();
        this.observeNavigationAndSubCategories();
        this.observeIsMobileScreen();
        this.observeMobileMenu();
    }

    public ngAfterViewInit(): void {
        this.observeSidenavOpen();
        this.observeSidenavClose();

        this.ngZone.runOutsideAngular(() => {
            const enter$ = fromEvent(this.menuView.nativeElement, 'mouseenter').pipe(map((event) => ({
                event,
                isEnter: true,
            })));
            const leave$ = fromEvent(this.menuView.nativeElement, 'mouseleave').pipe(map((event) => ({
                event,
                isEnter: false,
            })));

            merge(enter$, leave$)
                .pipe(
                    switchMap((res) => res.isEnter ? of(res) : timer(1000).pipe(map(() => res))),
                    filter((res) => this.menuService.isOverMode && !res.isEnter),
                    takeUntilOnDestroy(this),
                )
                .subscribe((res) => {
                    !this.isMobileScreen && this.hideMenuRightSide(res.event);
                });
        });
    }

    private assignSubCategories(): void {
        this.subCategories$ = combineLatest([this.menuService.getActiveDashboards$(), this.applications$, this.defaultMenuItems$, this.context$]).pipe(
            debounceTime(300),
            map(([dashboards, applications, defaultMenu]) => {
                const mainMenu = _.orderBy([...dashboards, ...applications], ['position'], 'asc');
                const menu: MenuItem[] = this.menuService.mapMenuCategories([...mainMenu, ...defaultMenu]);
                this.categories = this.menuService.getUniqMenuCategories(menu);
                this.menuByCategories = this.menuService.getGroupedMenuCategories(menu);
                if (this.isOnlyOtherCategory) {
                    this.menuService.setHoveredCategory(this.menuService.otherCategory);
                    return menu;
                }
                this.menuService.setMenuCategories(this.categories);
                return menu;
            }),
            takeUntilOnDestroy(this),
            shareReplay(1),
        );
    }

    private get applications$(): Observable<MenuItem[]> {
        return from(this.principal.identity()).pipe(
            switchMap(() => this.entityConfigService.entitySpec$()),
            switchMap((spec) => this.uiConfigService.config$().pipe(
                map((c) => c.sidebar?.hideApplication ? {} : {sidebar: c.sidebar || {}, spec})),
            ),
            map((sideBarConfig) => {
                if (!sideBarConfig.spec) {
                    sideBarConfig.spec = [];
                }
                let applications = sideBarConfig.spec.filter((t) => t.isApp);
                applications = applications.filter((t) => this.principal.hasPrivilegesInline([`APPLICATION.${t.key}`]));

                if (sideBarConfig.sidebar) {
                    sideBarConfig.sidebar.applicationTitle = this.translate.translate(
                        sideBarConfig.sidebar?.applicationTitle || 'global.menu.applications.main',
                        {},
                    );
                }

                return applicationsToCategory(applications, sideBarConfig);
            }),
        );
    }

    private get defaultMenuItems$(): Observable<MenuItem[]> {
        return this.uiConfigService.config$().pipe(
            map(i => i?.sidebar?.hideAdminConsole ? [] : getDefaultMenuList()),
        );
    }

    private get context$(): Observable<XmEventManagerAction<unknown>> {
        return this.eventManager.listenTo('CONTEXT_UPDATED')
            .pipe(
                startWith(null),
                takeUntilOnDestroy(this),
            );
    }

    private observeNavigationAndSubCategories(): void {
        combineLatest([
            this.subCategories$,
            this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        ]).pipe(
            debounceTime(this.isMobileScreen ? 100 : 0),
            map((i) => i[0]),
            takeUntilOnDestroy(this),
        ).subscribe((subCategories: MenuItem[]) => {
            const activeNode: MenuItem = this.getActiveNode(subCategories);
            this.selectedCategory = this.menuService.setCategoryOnRouteChange(activeNode, subCategories);
            this.setIsActiveRoute(activeNode);
            this.unfoldParentNode(activeNode);
        });
    }

    private observeIsMobileScreen(): void {
        this.menuService.isMobileView
            .pipe(takeUntilOnDestroy(this))
            .subscribe((isMobileScreen: boolean) => this.isMobileScreen = isMobileScreen);
    }

    private observeMobileMenu(): void {
        combineLatest([this.menuService.isMobileView, this.menuService.isMaterial3Menu, this.menuService.mobileMenuState])
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe(([isMobileView, isMaterial3Menu, mobileMenuState]: [boolean, boolean, MobileMenuState]) => {
                this.mobileMenuState = mobileMenuState;
                const {showCategories} = mobileMenuState || {};
                const isCategorySelectedInMobileView = isMobileView && showCategories;
                this.showMenuTree = isMaterial3Menu ? !isCategorySelectedInMobileView || !isMobileView : true;
            });
    }

    private setIsActiveRoute(activeNode: MenuItem): void {
        if (activeNode) {
            if (this.previousActiveNode) {
                this.previousActiveNode.isActiveRoute = false;
            }
            activeNode.isActiveRoute = true;
            this.previousActiveNode = activeNode;
        }
    }

    public observeSectionsFiltering(): void {
        this.menuService.hoveredCategory
            .pipe(
                debounceTime(this.isMobileScreen ? 0 : 250),
                observeOn(animationFrameScheduler),
                switchMap((category: HoveredMenuCategory) => {
                    const {hoveredCategory} = category;
                    const hoveredCategoryName: string = hoveredCategory?.name?.en?.toLowerCase();
                    if (!this.isMaterial3Menu) {
                        this.setStateForOldMenu(hoveredCategoryName);
                        return of(null);
                    }
                    if (!hoveredCategory) {
                        return from(this.menuService.sidenav.close());
                    }
                    const isSetCategory: boolean = !this.isMobileScreen ? (!this.menuService.sidenav.opened || this.hoveredCategory?.name?.en.toLowerCase() !== hoveredCategoryName) : true;
                    if (isSetCategory && this.menuByCategories) {
                        return this.setStateWhenCategoryChanged(hoveredCategoryName, category);
                    }
                    return of(hoveredCategory);
                }),
                takeUntilOnDestroy(this),
            )
            .subscribe();
    }

    private setStateForOldMenu(hoveredCategoryName: string): void {
        const otherCategoryName: string = this.menuService.otherCategory.name.en.toLowerCase();
        this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.SHOW;
        this.filteredCategories = this.menuByCategories?.[hoveredCategoryName || otherCategoryName] || [];
    }

    private setStateWhenCategoryChanged(hoveredCategoryName: string, category: HoveredMenuCategory): Observable<MatDrawerToggleResult | number> {
        const {hoveredCategory, isOpenMenu} = category;
        this.filteredCategories = this.menuByCategories[hoveredCategoryName] || [];
        const isOneLevelCategory = !!(this.filteredCategories?.length === 1 && this.filteredCategories[0]?.category?.isLinkWithoutSubcategories);
        if (!isOneLevelCategory) {
            this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.HIDE;
            this.hoveredCategory = hoveredCategory;
            const next$: Observable<MatDrawerToggleResult | number> =
                !this.menuService.sidenav.opened && isOpenMenu ? from(this.menuService.sidenav.open()) : timer(0);
            return next$.pipe(
                observeOn(animationFrameScheduler),
                tap(() => {
                    this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.SHOW;
                    this.menuService.setMobileMenuState({showCategories: false, category: hoveredCategory});
                }),
            );
        }

        this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.HIDE;
        return from(this.menuService.sidenav.close()).pipe(observeOn(animationFrameScheduler));
    }

    private observeSidenavOpen(): void {
        this.menuService.sidenav.openedStart
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this.menuService.setIsSidenavOpen(true));
    }

    private observeSidenavClose(): void {
        this.menuService.sidenav.closedStart
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.hoveredCategory = null;
                this.menuService.setIsSidenavOpen(false);
            });
    }

    public setSelectedCategory(node: MenuItem): void {
        const {parent} = node || {};
        this.selectedCategory = parent?.category || this.menuService.selectedCategory.value || this.menuService.otherCategory;
        this.menuService.selectedCategory.next(this.selectedCategory);
        this.parentCategory = parent;
        this.closeSidenavInMobileView();
    }

    public async hideMenuRightSide(event: any): Promise<void> {
        await this.menuService.hideMenuRightSide(this.selectedCategory, event);
    }

    public getActiveNode(nodes: MenuItem[]): MenuItem {
        return treeNodeSearch<MenuItem>(nodes,
            (item) => item.children,
            item => this.menuService.isActiveUrl(item),
        );
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public unfoldParentNode(child: MenuItem): void {
        if (!child) {
            return;
        }

        let node = child;
        const {parent} = node || {};
        if (!this.selectedCategory) {
            this.selectedCategory = parent?.category || this.menuService.selectedCategory.value || this.menuService.otherCategory;
            this.menuService.selectedCategory.next(this.selectedCategory);
        }
        !this.parentCategory && (this.parentCategory = parent);
        while ((node = node.parent)) {
            this.treeControl.expand(node);
        }
    }

    public groupNavigate(node: MenuItem, evt: Event): void {
        evt.preventDefault();

        let url = node.url;

        if (_.isEmpty(node.parent)) {
            const firstChild = _.head(node.children);

            if (firstChild) {
                url = firstChild.url;
            }
        }

        this.router.navigate(url);
    }

    public toggleOrNavigate(node: MenuItem, evt: Event): void {
        if (this.config?.mode == 'toggle') {
            this.toggle(node, evt);
        } else {
            this.groupNavigate(node, evt);
        }
    }

    public toggle(node: MenuItem, evt: Event): void {
        evt.preventDefault();
        evt.stopPropagation();

        if (!node.children?.length) {
            this.router.navigate(node.url);
            this.closeSidenavInMobileView();
            if (node.category) {
                this.menuService.selectedCategory.next(node.category);
                this.selectedCategory = node.category;
                this.parentCategory = node;
            }
            return;
        }

        if (this.treeControl.isExpanded(node)) {
            this.treeControl.collapse(node);

            return;
        }

        !this.isMaterial3Menu && this.treeControl.collapseAll();

        // Unfold current node
        this.unfoldParentNode(node);

        // Unfold each parent node from active nested child
        const active = this.getActiveNode([node]);
        this.unfoldParentNode(active);

        this.treeControl.expand(node);
    }

    public onBackToCategories(): void {
        this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.HIDE;
        setTimeout(() => this.menuService.setMobileMenuState({showCategories: true, category: undefined}), 120);
    }

    public isNodeExpanded(node: MenuItem): string {
        return this.treeControl.isExpanded(node) ? 'expanded' : 'collapsed';
    }

    public onHideSubCategoriesDone(): void {
        this.document.querySelector('cdk-tree .menu-link.active-with-stretch')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }

    private get isOnlyOtherCategory(): boolean {
        const categoriesKeys: string[] = Object.keys(this.menuByCategories);
        this.isMaterial3Menu = !(categoriesKeys?.length === 1 && categoriesKeys[0] === this.menuService.otherCategory.name.en.toLowerCase());
        this.menuService.setIsMaterial3Menu(this.isMaterial3Menu);
        return !this.isMaterial3Menu;
    }

    private closeSidenavInMobileView(): void {
        this.isMaterial3Menu && this.isMobileScreen && this.menuService.sidenav.close();
    }
}
