import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_HTML_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'html',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.XmHtmlComponent),
    },
    {
        selector: 'innerHTML',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.XmInnerHtmlWidget),
    },
    {
        selector: 'html-value',
        loadChildren: () => import('@xm-ngx/components/html').then(m => m.XmHtmlValueComponent),
    },
];
