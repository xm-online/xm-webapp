import { XmPresentationLayout } from '@xm-ngx/dynamic';

export interface XmBreadcrumb {
    url: string;
    label: string;
}

export interface XmBreadcrumbOptions {
    lastSegmentLayout: XmPresentationLayout[];
}
