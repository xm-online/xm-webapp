import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import * as _ from 'lodash';
import { combineLatest, from, Observable } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';

import { ContextService, Principal } from '../../../src/app/shared';
import { getDefaultMenuList } from './default-menu-list';
import { NestedTreeControl } from '@angular/cdk/tree';
import { treeNodeSearch } from '../../shared/operators/src/tree-search';
import { buildMenuTree } from './nested-menu';
import { applicationsToCategory, filterByConditionDashboards } from './flat-menu';
import { MenuItem, MenuOptions } from '@xm-ngx/components/menu/menu.interface';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

@Component({
    selector: 'xm-menu',
    templateUrl: './menu.component.html',
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
    host: {
        class: 'xm-menu',
    },
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

    constructor(
        protected readonly dashboardService: DashboardStore,
        protected readonly router: Router,
        protected readonly principal: Principal,
        protected readonly uiConfigService: XmPublicUiConfigService<{ sidebar?: { hideAdminConsole?: boolean; hideApplication?: boolean; } }>,
        protected readonly entityConfigService: XmEntitySpecWrapperService,
        protected readonly contextService: ContextService,
    ) {
    }

    public hasChild = (_: number, node: MenuItem): boolean => {
        return node.isLink == null ? (!!node.children && node.children.length > 0) : !node.isLink;
    }

    public ngOnInit(): void {
        const dashboards$ = this.dashboardService.dashboards$().pipe(
            startWith([]),
            filter((dashboards) => Boolean(dashboards)),
            map((i) => filterByConditionDashboards(i, this.contextService)),
            map((i) => _.filter(i, (j) => (!j.config?.menu?.section || j.config.menu.section === 'xm-menu'))),
            map(dashboards => buildMenuTree(dashboards)),
        );

        const applications$ = from(this.principal.identity()).pipe(
            switchMap(() => this.entityConfigService.entitySpec$()),
            switchMap((spec) => this.uiConfigService.config$().pipe(
                map((c) => c.sidebar?.hideApplication ? [] : spec)),
            ),
            map((spec) => {
                if (!spec) {
                    spec = [];
                }
                let applications = spec.filter((t) => t.isApp);
                applications = applications.filter((t) => this.principal.hasPrivilegesInline([ `APPLICATION.${ t.key }` ]));
                return applications;
            }),
            map((dashboards) => applicationsToCategory(dashboards)),
        );

        const default$ = this.uiConfigService.config$().pipe(
            take(1),
            map(i => i?.sidebar?.hideAdminConsole ? [] : getDefaultMenuList()),
            shareReplay(1),
        );

        this.categories$ = combineLatest([ dashboards$, applications$, default$ ]).pipe(
            map(([ a, b, c ]) => [ ...a, ...b, ...c ]),
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
            this.unfoldParentNode(active);
        });
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

        this.treeControl.collapseAll();

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
}
