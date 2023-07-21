import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';

export interface XmBreadcrumb {
    url: string;
    label: string;
}

export interface XmBreadcrumbOptions {
    lastSegmentLayout: XmDynamicPresentationLayout[];
}
