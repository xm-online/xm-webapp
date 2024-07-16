import { XmBreadcrumbOptions } from '@xm-ngx/components/breadcrumb/interfaces/xm-breadcrumb.interface';

export interface XmBreadcrumbRouteData {
    title: string;
    dashboard?: {
        config: {
            breadcrumbs?: XmBreadcrumbOptions
        }
    }
}
