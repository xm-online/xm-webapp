import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { Params } from '@angular/router';

export interface XmBreadcrumb {
    url: string;
    label: string;
    queryParams: Params;
    config?: XmBreadcrumbOptions
}

export interface XmBreadcrumbOptions {
    lastSegmentLayout: XmDynamicPresentationLayout[];
}
