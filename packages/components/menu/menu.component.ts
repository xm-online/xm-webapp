import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {matExpansionAnimations} from '@angular/material/expansion';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import {DashboardStore} from '@xm-ngx/core/dashboard';
import {XmEntitySpecWrapperService} from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import {combineLatest, from, Observable} from 'rxjs';
import {filter, map, shareReplay, startWith, switchMap} from 'rxjs/operators';

import {ContextService} from '@xm-ngx/core/context';
import {Principal, XmUserService} from '@xm-ngx/core/user';
import {getDefaultMenuList} from './default-menu-list';
import {CdkTreeModule, NestedTreeControl} from '@angular/cdk/tree';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy, treeNodeSearch} from '@xm-ngx/operators';
import {buildMenuTree} from './nested-menu';
import {applicationsToCategory, filterByConditionDashboards} from './flat-menu';
import {GlobalMenuCategory, MenuItem, MenuOptions} from './menu.interface';
import {XmUiConfigService} from '@xm-ngx/core/config';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Translate, XmTranslateService, XmTranslationModule} from '@xm-ngx/translation';
import {CommonModule, DOCUMENT} from '@angular/common';
import {XmPermissionModule} from '@xm-ngx/core/permission';
import {ConditionDirective} from '@xm-ngx/components/condition';
import {showHideSubCategories} from '@xm-ngx/dashboard/menu/menu.animtion';

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
        showHideSubCategories
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
export class MenuComponent implements OnInit, OnDestroy {
    private _config: MenuOptions;

    @Input() set config(value: MenuOptions | null) {
        this._config = _.defaultsDeep(value, {
            'mode': 'toggle',
        });
    }

    get config(): MenuOptions {
        return this._config;
    }

    public treeControl = new NestedTreeControl<MenuItem>(node => node.children);
    public categories$: Observable<MenuItem[]>;
    public globalCategories: GlobalMenuCategory[];
    public filteredCategories: MenuItem[];
    public selectedCategory: GlobalMenuCategory;
    public hoveredCategory: GlobalMenuCategory;
    public parentCategory: MenuItem;

    constructor(
        protected readonly dashboardService: DashboardStore,
        protected readonly router: Router,
        protected readonly principal: Principal,
        protected readonly translate: XmTranslateService,
        protected readonly uiConfigService: XmUiConfigService<ISideBarConfig>,
        protected readonly entityConfigService: XmEntitySpecWrapperService,
        protected readonly contextService: ContextService,
        protected readonly userService: XmUserService,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    public hasChild = (_: number, node: MenuItem): boolean => {
        return node.isLink == null ? (!!node.children && node.children.length > 0) : !node.isLink;
    };

    public ngOnInit(): void {
        const dashboards$ = this.getActiveDashboards();

        const applications$ = from(this.principal.identity()).pipe(
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

        const default$ = this.uiConfigService.config$().pipe(
            map(i => i?.sidebar?.hideAdminConsole ? [] : getDefaultMenuList()),
        );

        this.categories$ = combineLatest([dashboards$, applications$, default$]).pipe(
            map(([dashboards, applications, defaultMenu]) => {
                const mainMenu = _.orderBy([...dashboards, ...applications], ['position'], 'asc');
                return [...mainMenu, ...defaultMenu];
            }),
            takeUntilOnDestroy(this),
            shareReplay(1),
        );

        combineLatest([
            this.categories$,
            this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        ]).pipe(
            map((i) => i[0]),
            takeUntilOnDestroy(this),
        ).subscribe(a => {
            const active = this.getActiveNode(a);
            !this.selectedCategory && this.filterSections(a, active?.parent?.globalCategory);
            this.unfoldParentNode(active);
        });

        // TODO do this configuration in Administration > Configuration > Specification > UI section
        const sidebarEl: HTMLElement = this.document.querySelector('.vf-sidebar-menu-scroll');
        sidebarEl.classList.remove('overflow-auto');
        sidebarEl.style.overflowY = 'hidden';
        sidebarEl.style.height = '100%';
    }

    public scrollToSelectedLink(): void {
        this.document.querySelector('cdk-tree .menu-link.active')?.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    private getActiveDashboards(): Observable<MenuItem[]> {
        return this.userService.user$().pipe(
            switchMap((user) => {
                return this.dashboardService.dashboards$().pipe(
                    startWith([]),
                    filter((dashboards) => Boolean(dashboards)),
                    map((i) => filterByConditionDashboards(i, this.contextService)),
                    map((i) => _.filter(i, (j) => (!j.config?.menu?.section || j.config.menu.section === 'xm-menu'))),
                    map((dashboards) => {
                        if (dashboards?.length) {
                            const menu: MenuItem[] = buildMenuTree(dashboards, ConditionDirective.checkCondition, {user: user});
                            this.globalCategories =
                                menu.filter((menuItem: MenuItem) => menuItem.globalCategory)
                                    .map((menuItem: MenuItem) => menuItem.globalCategory);
                            this.globalCategories.push(this.otherGlobalCategory);
                            return menu;
                        }
                        return [];
                    }),
                );
            }),
        );
    }

    public filterSections(categories: MenuItem[], selectedCategory: GlobalMenuCategory): void {
        if (!selectedCategory) {
            selectedCategory = this.otherGlobalCategory;
        }
        const selectedCategoryName: string = selectedCategory.name.en.toLowerCase();
        if (this.hoveredCategory?.name?.en.toLowerCase() !== selectedCategoryName) {
            this.filteredCategories = null;
            this.hoveredCategory = selectedCategory;
            setTimeout(() => {
                this.filteredCategories = categories.filter((category: MenuItem) => {
                    if (selectedCategoryName === 'other') {
                        return !category?.globalCategory;
                    }
                    return category?.globalCategory?.name?.en.toLowerCase() === selectedCategoryName;
                });
            });
        }
    }

    public setSelectedGlobalCategory(node: MenuItem): void {
        const { parent } = node || {};
        this.selectedCategory = parent?.globalCategory || this.otherGlobalCategory;
        this.parentCategory = parent;
    }

    public getActiveNode(nodes: MenuItem[]): MenuItem {
        return treeNodeSearch<MenuItem>(nodes,
            (item) => item.children,
            item => {
                return this.router.isActive(item.url?.join('/'), {
                    fragment: 'ignored',
                    matrixParams: 'ignored',
                    queryParams: 'ignored',
                    paths: 'exact',
                });
            },
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
        const { parent } = node || {};
        !this.selectedCategory && (this.selectedCategory = parent?.globalCategory || this.otherGlobalCategory);
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

        if (this.treeControl.isExpanded(node)) {
            this.treeControl.collapse(node);

            return;
        }

        // this.treeControl.collapseAll();

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

    private get otherGlobalCategory(): GlobalMenuCategory {
        return {
            name: {
                en: 'Other',
                ru: 'Іньше',
                uk: 'Іньше',
            },
            icon: 'more_horiz',
        };
    }
}
