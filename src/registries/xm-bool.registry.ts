import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_BOOL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/bool',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool` instead */
        selector: '@xm-ngx/components/xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolModule),
    },
    {
        selector: '@xm-ngx/components/bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool-control` instead */
        selector: '@xm-ngx/components/xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControlModule),
    },
    {
        selector: '@xm-ngx/components/checkbox-control',
        loadChildren: () => import('@xm-ngx/components/bool/checkbox-control').then(m => m.XmCheckboxControlModule),
    },
    {
        selector: '@xm-ngx/components/checkbox',
        loadChildren: () => import('@xm-ngx/components/bool/checkbox').then((m) => m.XmCheckboxModule),
    }
];
