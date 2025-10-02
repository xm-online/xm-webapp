import { Injectable } from '@angular/core';
import { XmUIConfig, XmUiConfigService } from '@xm-ngx/core/config';
import * as _ from 'lodash';
import { forkJoin, Observable, zip } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { Dashboard } from '@xm-ngx/core/dashboard';
import { XmUserService } from '@xm-ngx/core/user';

function getWithConfig(idOrSlug: number | string | null, dashboards: Dashboard[]): Dashboard | null {
    if (!idOrSlug || !dashboards) {
        return null;
    }
    return dashboards.find((d) => (d.config && d.config.slug === idOrSlug));
}

export interface DashboardUiConfig extends XmUIConfig {
    defaultDashboard: string;
    defaultDashboardForRole?: {
        role: string;
        dashboard: string
    }[];
}


@Injectable({ providedIn: 'root' })
export class DefaultDashboardService {

    constructor(
        private xmConfigService: XmUiConfigService<DashboardUiConfig>,
        private dashboardWrapperService: DashboardStore,
        public userService: XmUserService
    ) {
    }

    public getFromConfig(): Observable<Dashboard | null> {
        return this.getDefaultAndDashboards$().pipe(
            map(([c, d]) => getWithConfig(c, d)),
        );
    }

    public getDefaultOrFirstAvailable(): Observable<Dashboard | null> {
        const getWithOrderIndex = (dashboards: Dashboard[]): Dashboard | null => {
            if (!dashboards) {
                return null;
            }
            const sorted = _.sortBy(dashboards, (d) => d.config?.orderIndex);
            return sorted[0] || null;
        };

        return this.getDefaultAndDashboards$().pipe(
            map(([config, dashboards]) => {
                const withConfig = getWithConfig(config, dashboards);
                if (withConfig) {
                    return withConfig;
                }

                return getWithOrderIndex(dashboards);
            }),
        );
    }

    private getDefaultAndDashboards$(): Observable<[number | string | null, Dashboard[] | null]> {
        const config$ = forkJoin([
            this.xmConfigService.config$().pipe(take(1)),
            this.userService.user$().pipe(take(1)),
        ]).pipe(
            map(([config, user]) => {
                const defaultForRole = config?.defaultDashboardForRole?.find(d => d.role === user.roleKey);
                return defaultForRole?.dashboard ?? config?.defaultDashboard ?? null;
            })
        );

        const dashboards$ = this.dashboardWrapperService.dashboards$().pipe(
            filter((ds) => Boolean(ds)),
            take(1),
        );

        return zip(config$, dashboards$);
    }

}
