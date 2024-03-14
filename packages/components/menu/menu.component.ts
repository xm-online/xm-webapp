import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {matExpansionAnimations} from '@angular/material/expansion';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {DashboardStore} from '@xm-ngx/core/dashboard';
import {XmEntitySpecWrapperService} from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import {animationFrameScheduler, combineLatest, debounceTime, from, Observable, observeOn, of, tap, timer} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap} from 'rxjs/operators';

import {ContextService} from '@xm-ngx/core/context';
import {Principal, XmUserService} from '@xm-ngx/core/user';
import {getDefaultMenuList} from './default-menu-list';
import {CdkTreeModule, NestedTreeControl} from '@angular/cdk/tree';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy, treeNodeSearch} from '@xm-ngx/operators';
import {buildMenuTree} from './nested-menu';
import {applicationsToCategory, filterByConditionDashboards} from './flat-menu';
import {HoveredMenuCategory, MenuCategory, MenuItem, MenuOptions} from './menu.interface';
import {XmUiConfigService} from '@xm-ngx/core/config';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Translate, XmTranslateService, XmTranslationModule} from '@xm-ngx/translation';
import {CommonModule, DOCUMENT} from '@angular/common';
import {XmPermissionModule} from '@xm-ngx/core/permission';
import {ConditionDirective} from '@xm-ngx/components/condition';
import {XmEventManager, XmEventManagerAction} from '@xm-ngx/core';
import {showHideSubCategories} from './menu.animation';
import {MenuService} from './menu.service';
import {MatDrawerToggleResult} from '@angular/material/sidenav';
import {MenuPositionEnum, MenuSubcategoriesAnimationStateEnum} from './menu.model';

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
        showHideSubCategories,
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
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
    private _config: MenuOptions;
    private previousActiveNode: MenuItem;

    @Input() set config(value: MenuOptions | null) {
        this._config = _.defaultsDeep(value, {
            'mode': 'toggle',
        });
        this.menuService.setBrandLogo(value.logo);
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
    public isOldMenu: boolean;

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
        @Inject(DOCUMENT) private document: Document
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

        // this.uiFix();
    }

    public ngAfterViewInit(): void {
        this.observeSidenavOpen();
        this.observeSidenavClose();
    }

    // private uiFix(): void {
    //     // This changes should be implemented with configuration in Administration > Configuration > Specification > UI section
    //     // TODO Must be removed after changes in configuration. Should be approved by all users.
    //     const sidebarEl: HTMLElement = this.document.querySelector('.vf-sidebar-menu-scroll');
    //     sidebarEl.classList.remove('overflow-auto');
    //     sidebarEl.style.overflowY = 'hidden';
    //     sidebarEl.style.height = '100%';
    //     sidebarEl.style.maxHeight = '100%';
    // }

    private assignSubCategories(): void {
        this.subCategories$ = combineLatest([this.activeDashboards$, this.applications$, this.defaultMenuItems$, this.context$]).pipe(
            debounceTime(300),
            map(([dashboards, applications, defaultMenu]) => {
                const mainMenu = _.orderBy([...dashboards, ...applications], ['position'], 'asc');
                const menu: MenuItem[] = this.menuService.mapMenuCategories([...mainMenu, ...defaultMenu]);
                this.categories = this.menuService.getUniqMenuCategories(menu);
                this.menuByCategories = this.menuService.getGroupedMenuCategories(menu);
                if (this.isOnlyOtherCategory) {
                    return menu;
                }
                this.menuService.setMenuCategories(this.categories);
                return menu;
            }),
            takeUntilOnDestroy(this),
            shareReplay(1),
        );
    }

    private get activeDashboards$(): Observable<MenuItem[]> {
        return this.userService.user$().pipe(
            switchMap((user) => {
                return this.dashboardService.dashboards$().pipe(
                    filter((dashboards) => Boolean(dashboards)),
                    map((i) => filterByConditionDashboards(i, this.contextService)),
                    map((i) => _.filter(i, (j) => (!j.config?.menu?.section || j.config.menu.section === 'xm-menu'))),
                    map((dashboards) => {
                        if (dashboards?.length) {
                            return buildMenuTree(dashboards, ConditionDirective.checkCondition, {user});
                        }
                        return [];
                    }),
                );
            }),
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
            map((i) => i[0]),
            takeUntilOnDestroy(this),
        ).subscribe((subCategories: MenuItem[]) => {
            const activeNode: MenuItem = this.getActiveNode(subCategories);
            this.selectedCategory = this.menuService.setCategoryOnRouteChange(activeNode, subCategories);
            this.setIsActiveRoute(activeNode);
            this.unfoldParentNode(activeNode);
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
                debounceTime(250),
                observeOn(animationFrameScheduler),
                switchMap((category: HoveredMenuCategory) => {
                    const {hoveredCategory, isOpenMenu} = category;
                    const hoveredCategoryName: string = hoveredCategory?.name?.en?.toLowerCase();
                    if (this.isOldMenu) {
                        const otherCategoryName: string = this.menuService.otherCategory.name.en.toLowerCase();
                        this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.SHOW;
                        this.filteredCategories = this.menuByCategories[hoveredCategoryName || otherCategoryName] || [];
                    }
                    if (!hoveredCategory || this.isOldMenu) {
                        return of(null);
                    }
                    if (this.hoveredCategory?.name?.en.toLowerCase() !== hoveredCategoryName && this.menuByCategories) {
                        this.filteredCategories = this.menuByCategories[hoveredCategoryName] || [];
                        const isOneLevelCategory = !!(this.filteredCategories?.length === 1 && this.filteredCategories[0]?.category?.isLinkWithoutSubcategories);
                        if (!isOneLevelCategory) {
                            this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.HIDE;
                            this.hoveredCategory = hoveredCategory;
                            const next$: Observable<MatDrawerToggleResult | number> =
                                !this.menuService.sidenav.opened && isOpenMenu ? from(this.menuService.sidenav.open()) : timer(0);
                            return next$.pipe(
                                observeOn(animationFrameScheduler),
                                tap(() => this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.SHOW),
                            );
                        }

                        this.showSubCategoriesState = MenuSubcategoriesAnimationStateEnum.HIDE;
                        return from(this.menuService.sidenav.close()).pipe(observeOn(animationFrameScheduler));
                    }
                    return of(hoveredCategory);
                }),
                takeUntilOnDestroy(this),
            )
            .subscribe();
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

        this.isOldMenu && this.treeControl.collapseAll();

        // Unfold current node
        this.unfoldParentNode(node);

        // Unfold each parent node from active nested child
        const active = this.getActiveNode([node]);
        this.unfoldParentNode(active);

        this.treeControl.expand(node);
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
        this.isOldMenu = categoriesKeys?.length === 1 && categoriesKeys[0] === this.menuService.otherCategory.name.en.toLowerCase();
        this.menuService.setIsOldMenu(this.isOldMenu);
        return this.isOldMenu;
    }
}
