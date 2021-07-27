import { XmBreadcrumbResolver } from './xm-breadcrumb.resolver';
import { ActivatedRouteSnapshot } from '@angular/router';
import { XmBreadcrumbRouteData } from '../interfaces/xm-breadcrumb-route-data.interface';
import { XmBreadcrumb } from '../interfaces/xm-breadcrumb.interface';

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
}

export class XmBreadcrumbDefaultResolver extends XmBreadcrumbResolver {
    public getBreadcrumbs(route: ActivatedRouteSnapshot): XmBreadcrumb[] {
        if (!route) {
            return [];
        }

        const breadcrumb = XmBreadcrumbDefaultResolver.getBreadcrumb(route);

        if (!breadcrumb) {
            return this.getBreadcrumbs(route.firstChild);
        }

        const child = this.getBreadcrumbs(route.firstChild);
        return [breadcrumb, ...child];
    }

    private static getBreadcrumb(route: ActivatedRouteSnapshot): XmBreadcrumb {
        const data = route.data as XmBreadcrumbRouteData;
        if (!data) {
            return null;
        }

        if (String(route.url) === '') {
            return null;
        }

        if (!data.title) {
            return null;
        }

        const title = data.title;
        return {
            label: title,
            url: getResolvedUrl(route),
        };
    }
}
