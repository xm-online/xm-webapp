import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_HTML_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/html',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.XmHtmlModule),
    },
    {
        selector: '@xm-ngx/components/innerHTML',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.InnerHTMLModule),
    },
];
