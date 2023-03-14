import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_LINK_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/link',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLink),
    },
    {
        /** @deprecated use `@xm-ngx/components/link` instead */
        selector: '@xm-ngx/components/link-value',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLink),
    },
    {
        selector: '@xm-ngx/components/xm-link-view',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewComponent),
    },
    {
        selector: '@xm-ngx/components/xm-link-copy',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewCopyComponent),
    },
    {
        selector: '@xm-ngx/components/link-button',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkButtonComponent),
    },
];
