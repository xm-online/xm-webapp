import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ENUM_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum` instead */
        selector: '@xm-ngx/components/enum-value',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumComponent),
    },

    {
        selector: '@xm-ngx/components/enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumView),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-view` instead */
        selector: '@xm-ngx/components/xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumView),
    },
    {
        selector: '@xm-ngx/components/enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-control` instead */
        selector: '@xm-ngx/components/xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControl),
    },
    {
        selector: '@xm-ngx/components/multiple-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmMultipleEnumControl),
    },
    {
        selector: '@xm-ngx/components/icon-enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmIconEnumComponent),
    },
    {
        selector: '@xm-ngx/components/radio-group-control',
        loadChildren: () => import('@xm-ngx/components/radio-group').then(m => m.XmRadioGroupControlModule),
    },
    {
        selector: '@xm-ngx/components/multi-select',
        loadChildren: () => import('@xm-ngx/components/multi-select/multi-select.component').then(m => m.XmMultiSelectControlModule),
    },
];
