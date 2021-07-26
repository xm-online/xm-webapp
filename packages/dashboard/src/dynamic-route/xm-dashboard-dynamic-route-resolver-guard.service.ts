import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArgumentException } from '@xm-ngx/shared/exceptions';
import * as _ from 'lodash';
import { XmDynamicRouteResolverGuard } from '@xm-ngx/dynamic/route';
import { DashboardStore } from '../stores/dashboard-store.service';
import { Dashboard } from '../models/dashboard.model';
import { DashboardGuard } from '../guards/dashboard.guard';
import { DynamicLoader } from '@xm-ngx/dynamic';

export type RouteFactory = (dashboard: Dashboard, slug: string) => Route;

export function dashboardRoutesFactory(
    dashboards: Dashboard[],
    containerFactory: RouteFactory,
    routeFactory: RouteFactory,
): Routes {
    const routes: Routes = [];
    dashboards = _.orderBy(dashboards, ['config.orderIndex', 'config.slug']);
    dashboards = _.filter(dashboards, dashboard => {
        if (dashboard.config?.slug === undefined || dashboard.config.slug === null) {
            console.warn(`Dashboard should have a config.slug, otherwise "id" will be used instead! id=${dashboard.id}, name=${dashboard.name}.`);
            _.set(dashboard, 'config.slug', `${dashboard.id}`);
        }
        return true;
    });

    _.forEach(dashboards, (dashboard) => {
        let parentRoutes = routes;
        const slugs = _.split(dashboard.config.slug, '/');
        for (const slug of slugs) {
            const node = _.find(parentRoutes, (r) => r.path === slug) || null;

            if (node === null) {
                // check for a new child
                if (_.last(slugs) === slug) {

                    const child = _.find(dashboards, d => _.startsWith(d.config.slug, dashboard.config.slug) && d !== dashboard);
                    if (child !== null && child !== undefined) {
                        const route = containerFactory(dashboard, slug);
                        parentRoutes.push(route);
                    } else {
                        const route = routeFactory(dashboard, slug);
                        parentRoutes.push(route);
                    }

                } else {
                    console.warn(`Dashboard with the slug "${dashboard.config.slug}", must have a parent dashboard with the slug equals to "${slug}", id=${dashboard.config.slug}, name=${dashboard.name}.`);
                    return;
                }
            } else {
                if (_.last(slugs) !== slug) {
                    parentRoutes = node.children;
                } else {
                    console.warn(`Dashboard with the slug "${dashboard.config.slug}" exists already, id=${dashboard.id}, name=${dashboard.name}.`);
                    return;
                }
            }
        }
    });

    return routes;
}


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
        const routeFactory: RouteFactory = (dashboard, slug: string) => {
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

        const containerFactory: RouteFactory = (dashboard, slug: string) => {
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

        return dashboardRoutesFactory(dashboards, containerFactory, routeFactory);
    }
}
