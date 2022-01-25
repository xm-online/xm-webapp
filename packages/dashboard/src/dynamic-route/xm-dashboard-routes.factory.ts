import { Dashboard } from '@xm-ngx/dashboard';
import { Route, Routes } from '@angular/router';
import * as _ from 'lodash';

export type XmDashboardRouteFactory = (dashboard: Dashboard, slug: string) => Route;

/**
 * Generates angular routes based on dashboards lit
 * @param dashboards - list of dashboards
 * @param containerFactory - produce a node with children
 * @param routeFactory - produce node with loadChildren or Component
 *
 * @example
 * ```typescript
 * // dashboards
 * const dashboards: Dashboard[] = [
 *   { config: { slug: 'users' } },
 *   { config: { slug: 'users/:id' } },
 *   { config: { slug: 'users/:id/edit' } },
 * ];
 *
 * // routeFactory
 * const routeFactory: XmDashboardRouteFactory = (dashboard, slug: string) => ({
 *   path: slug,
 *   data: { dashboard },
 * });
 *
 * // containerFactory
 * const containerFactory: XmDashboardRouteFactory = (dashboard, slug: string) => ({
 *   path: slug,
 *   data: { dashboard },
 *   children: [routeFactory(dashboard, '')],
 * });
 *
 * // Result:
 * const expectedResult: Routes = [{
 *   path: 'users',
 *   data: { dashboard: dashboards[0] },
 *   children: [
 *     { path: '', data: { dashboard: dashboards[0] } },
 *     {
 *        path: ':id', data: { dashboard: dashboards[1] },
 *        children: [
 *          { path: '', data: { dashboard: dashboards[1] } },
 *          { path: 'edit', data: { dashboard: dashboards[2] } },
 *        ],
 *      },
 *    ],
 *  }];
 * ```
 */
export function xmDashboardRoutesFactory(
    dashboards: Dashboard[],
    containerFactory: XmDashboardRouteFactory,
    routeFactory: XmDashboardRouteFactory,
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
        const lastSlug = _.last(slugs);

        for (const slug of slugs) {
            const node = _.find(parentRoutes, (r) => r.path === slug) || null;

            if (node === null) {
                // check for a new child
                if (lastSlug === slug) {

                    const child = _.find(dashboards, d => _.startsWith(d.config.slug, dashboard.config.slug) && d !== dashboard);
                    if (child !== null && child !== undefined) {
                        const route = containerFactory(dashboard, slug);
                        parentRoutes.push(route);
                    } else {
                        const route = routeFactory(dashboard, slug);
                        parentRoutes.push(route);
                    }

                } else {
                    console.warn(`Dashboard with the slug "${dashboard.config.slug}", must have a parent dashboard with the slug equals to "${slug}", id=${dashboard.id}, name=${dashboard.name}.`);
                    return;
                }
            } else {
                if (lastSlug !== slug) {
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
