import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ArgumentException } from '@xm-ngx/shared/exceptions';
import * as _ from 'lodash';
import { XmDynamicRouteResolverGuard } from '@xm-ngx/dynamic/route';
import { DashboardStore } from '../stores/dashboard-store.service';
import { Dashboard } from '../models/dashboard.model';
import { DashboardGuard } from '../guards/dashboard.guard';
import { DynamicLoader } from '@xm-ngx/dynamic';
import { XmDashboardRouteFactory, xmDashboardRoutesFactory } from './xm-dashboard-routes.factory';


@Injectable()
export class XmDashboardDynamicRouteResolverGuard
    extends XmDynamicRouteResolverGuard
    implements CanLoad, CanActivate {
    private routes: Routes | null = null;

    constructor(
        private dashboardStore: DashboardStore,
        private dynamicLoader: DynamicLoader,
    ) {
        super();
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        delete route.routeConfig['_loadedConfig'];
        return this.canLoad();
    }

    public getRoutes(): Routes | null {
        return this.routes;
    }

    public canLoad(): Observable<boolean> {
        return this.getRoutes$().pipe(
            map((routes) => {
                this.routes = routes;
                return true;
            }),
        );
    }

    private getRoutes$(): Observable<Routes> {
        return this.dashboardStore.dashboards$().pipe(
            map((dashboards) => {
                if (dashboards === null) {
                    throw new ArgumentException('Dashboards should not be empty!');
                }
                const routes = this.dashboardRoutesFactory(dashboards);

                // Add the default empty page
                if (!_.find(this.routes, d => d.path === '')) {
                    // Redirect to first available
                    routes.unshift({ path: '', pathMatch: 'full', canActivate: [DashboardGuard] });
                }

                // Add the default not-found page
                if (!_.find(this.routes, d => d.path === '**')) {
                    // Redirect to first available
                    routes.push({ path: '**', canActivate: [DashboardGuard] });
                }

                return routes;
            }),
        );
    }

    private dashboardRoutesFactory(dashboards: Dashboard[]): Routes {
        const routeFactory: XmDashboardRouteFactory = (dashboard, slug: string) => {
            const selector = dashboard.config.selector || '@xm-ngx/dashboard/default-dashboard';
            return {
                path: slug,
                data: {
                    title: dashboard.config?.name || dashboard.name,
                    dashboard,
                },
                loadChildren: () => this.dynamicLoader.getEntry(selector)
                    .then(e => e.loadChildren()),
            };
        };

        const containerFactory: XmDashboardRouteFactory = (dashboard, slug: string) => {
            return {
                path: slug,
                data: {
                    title: dashboard.config?.name || dashboard.name,
                    dashboard,
                },
                children: [
                    routeFactory(dashboard, ''),
                ],
            };
        };

        return xmDashboardRoutesFactory(dashboards, containerFactory, routeFactory);
    }
}
