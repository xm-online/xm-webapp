import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_LINK_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'link',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLink),
    },
    {
        /** @deprecated use `@xm-ngx/components/link` instead */
        selector: 'link-value',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLink),
    },
    {
        selector: 'xm-link-view',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewComponent),
    },
    {
        selector: 'xm-link-copy',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkViewCopyComponent),
    },
    {
        selector: 'link-button',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.XmLinkButtonComponent),
    },
    {
        selector: 'xm-link-with-subtext',
        loadChildren: () => import('@xm-ngx/components/link').then(m => m.LinkWithSubtextComponent),
    },
    {
        selector: 'xm-external-link-button',
        loadChildren: () => import('@xm-ngx/components/link/xm-external-link-button/xm-external-link-button.component').then(m => m.XmExternalLinkButtonComponent),
    },
];
