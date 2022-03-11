import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { XmPublicUiConfigService } from '@xm-ngx/core';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import * as _ from 'lodash';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

import { ContextService, Principal } from '../../../src/app/shared';
import { getDefaultMenuList } from './default-menu-list';
import { NestedTreeControl } from '@angular/cdk/tree';
import { treeNodeSearch } from '../../shared/operators/src/tree-search';
import { buildMenuTree } from './nested-menu';
import { applicationsToCategory, filterByConditionDashboards } from './flat-menu';
import { MenuItem } from '@xm-ngx/components/menu/menu.interface';

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
    private unsubscribe = new Subject<void>();

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

    public hasChild = (_: number, node: any): boolean => node.isLink == null ? (!!node.children && node.children.length > 0) : !node.isLink;

    public ngOnInit(): void {
        const dashboards$ = this.dashboardService.dashboards$().pipe(
            startWith([]),
            takeUntil(this.unsubscribe),
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
            takeUntil(this.unsubscribe),
        );

        this.categories$ = combineLatest([ dashboards$, applications$, default$ ]).pipe(
            map(([ a, b, c ]) => [ ...a, ...b, ...c ]),
            shareReplay(1),
            takeUntil(this.unsubscribe),
        );

        combineLatest([
            this.categories$,
            this.router.events.pipe(filter((e) => e instanceof NavigationEnd)),
        ]).pipe(
            map((i) => i[0]),
            takeUntil(this.unsubscribe),
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
        this.unsubscribe.next();
        this.unsubscribe.complete();
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

    public toggle(node: MenuItem, evt?: Event): void {
        evt?.preventDefault();

        // If node is expand, collapse it and exit from toggle function
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
