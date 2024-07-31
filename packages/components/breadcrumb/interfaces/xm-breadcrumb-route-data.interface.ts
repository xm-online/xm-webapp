import { XmBreadcrumbOptions } from './xm-breadcrumb.interface';

export interface XmBreadcrumbRouteData {
    title: string;
    dashboard?: {
        config: {
            breadcrumbs?: XmBreadcrumbOptions
        }
    }
}
