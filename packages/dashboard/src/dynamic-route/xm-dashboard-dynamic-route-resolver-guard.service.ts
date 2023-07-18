import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Routes, } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ArgumentException } from '@xm-ngx/exceptions';
import * as _ from 'lodash';
import { XmDynamicRouteResolverGuard } from '@xm-ngx/dynamic/route';
import { DashboardStore } from '@xm-ngx/core/dashboard';
import { Dashboard } from '@xm-ngx/core/dashboard';
import { DashboardGuard } from '../guards/dashboard.guard';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic';
import { XmDashboardRouteFactory, xmDashboardRoutesFactory } from './xm-dashboard-routes.factory';


@Injectable()
export class XmDashboardDynamicRouteResolverGuard
    extends XmDynamicRouteResolverGuard {
    private routes: Routes | null = null;

    constructor(
        private dashboardStore: DashboardStore,
        private dynamicComponents: XmDynamicComponentRegistry,
    ) {
        super();
    }

    public override canActivate(): Observable<boolean> {
        return this.canLoad();
    }

    public override canDeactivate(_: unknown, route: ActivatedRouteSnapshot): Observable<boolean> {
        delete route.routeConfig['_loadedRoutes'];
        this.routes = null;
        return of(true);
    }

    public override getRoutes(): Routes | null {
        return this.routes;
    }

    public override canLoad(): Observable<boolean> {
        if (this.routes != null) {
            return of(true);
        }

        return this.getRoutes$().pipe(
            map((routes) => {
                this.routes = routes;
                return true;
            }),
            catchError(() => of(false)),
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
                    routes.unshift({
                        path: '',
                        children: [],
                        pathMatch: 'full',
                        canActivate: [DashboardGuard],
                    });
                }

                // Add the default not-found page
                if (!_.find(this.routes, d => d.path === '**')) {
                    // Redirect to first available
                    routes.push({ path: '**', children: [], canActivate: [DashboardGuard] });
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
                loadChildren: async () => {
                    const comp = await this.dynamicComponents.find(selector);
                    return comp.componentType;
                },
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
