import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_BOOL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'bool',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool` instead */
        selector: 'xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolComponent),
    },
    {
        selector: 'bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/bool-control` instead */
        selector: 'xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControl),
    },
    {
        selector: 'checkbox-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmCheckboxControl),
    },
];
