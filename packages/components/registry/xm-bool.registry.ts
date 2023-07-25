import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_BOOL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/bool',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool` instead */
        selector: '@xm-ngx/components/xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolComponent),
    },
    {
        selector: '@xm-ngx/components/bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool-control` instead */
        selector: '@xm-ngx/components/xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControl),
    },
    {
        selector: '@xm-ngx/components/checkbox-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmCheckboxControl),
    },
];
