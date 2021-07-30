import { ActivatedRouteSnapshot } from '@angular/router';
import { XmBreadcrumb } from '../interfaces/xm-breadcrumb.interface';


export abstract class XmBreadcrumbResolver {
    public abstract getBreadcrumbs(route: ActivatedRouteSnapshot): XmBreadcrumb[];
}
