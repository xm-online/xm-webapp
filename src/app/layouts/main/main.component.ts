import { Component, OnDestroy, OnInit } from '@angular/core';
import { filterByConditionDashboards } from '@xm-ngx/components/menu';
import { getDefaultMenuList } from '@xm-ngx/components/menu/default-menu-list';
import { applicationsToCategory } from '@xm-ngx/components/menu/flat-menu';
import { buildMenuTree } from '@xm-ngx/components/menu/nested-menu';
import { UIPublicConfig, XmSessionService } from '@xm-ngx/core';
import { XmUiConfigService } from '@xm-ngx/core/config';
import { DashboardStore } from '@xm-ngx/dashboard';
import { XmEntitySpecWrapperService } from '@xm-ngx/entity';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import _ from 'lodash';
import { filter, from, map, Observable, startWith, switchMap } from 'rxjs';
import { ContextService, Principal } from '../../shared';
import { XmApplicationConfigService } from '../../shared/spec';
import { VERSION } from '../../xm.constants';


@Component({
    selector: 'xm-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss', './heatmap-container.scss'],
})
export class XmMainComponent implements OnInit, OnDestroy {
    public resolved$: Observable<boolean> = this.xmConfigService.isResolved();
    public isGuestLayout: boolean = true;
    public hideIfEmpty: boolean = false;
    public config: UIPublicConfig = this.xmConfigService.getAppConfig();

    constructor(
        private xmConfigService: XmApplicationConfigService,
        private sessionService: XmSessionService,
        private uiConfigService: XmUiConfigService<{ sidebar?: { hideApplication?: boolean, hideAdminConsole?: boolean, hideIfEmpty?: boolean; } }>,
        private entityConfigService: XmEntitySpecWrapperService,
        private contextService: ContextService,
        private dashboardService: DashboardStore,
        private principal: Principal,
    ) {
        // eslint-disable-next-line no-console
        console.log(`app version ${VERSION}`);
    }

    public ngOnInit(): void {
        this.hideSideBarIfMenuListIsEmpty();
        this.sessionService.isActive().pipe(takeUntilOnDestroy(this)).subscribe(
            (auth) => this.isGuestLayout = !auth,
            () => this.isGuestLayout = true,
        );
        
    }

    public hideSideBarIfMenuListIsEmpty(): void {

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
            map(i => i?.sidebar?.hideAdminConsole ? [] : getDefaultMenuList())
        );

        this.uiConfigService.config$().pipe(
            filter((config) => config.sidebar?.hideIfEmpty),
            switchMap(() => default$),
            switchMap((menuList) => dashboards$.pipe(
                map((dashboards) => [...menuList, ...dashboards])
            )),
            switchMap((menuList) => applications$.pipe(
                map((applications) => [...menuList, applications])
            )),
            map((menuList) => this.hideIfEmpty = menuList.length > 0)
        ).subscribe();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
