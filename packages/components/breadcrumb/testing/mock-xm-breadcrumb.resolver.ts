import { ActivatedRouteSnapshot } from '@angular/router';
import { XmBreadcrumb } from '@xm-ngx/components/breadcrumb';

export class MockXmBreadcrumbResolver {
    public getBreadcrumbs(route: ActivatedRouteSnapshot): XmBreadcrumb[] {
        return [];
    }
}
