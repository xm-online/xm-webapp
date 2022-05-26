import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ENUM_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum` instead */
        selector: '@xm-ngx/components/enum-value',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumModule),
    },

    {
        selector: '@xm-ngx/components/enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumViewModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-view` instead */
        selector: '@xm-ngx/components/xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumViewModule),
    },
    {
        selector: '@xm-ngx/components/enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControlModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-control` instead */
        selector: '@xm-ngx/components/xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControlModule),
    },
    {
        selector: '@xm-ngx/components/multiple-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmMultipleEnumControlModule),
    },
    {
        selector: '@xm-ngx/components/icon-enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmIconEnumModule),
    },
    {
        selector: '@xm-ngx/components/radio-group-control',
        loadChildren: () => import('@xm-ngx/components/radio-group').then(m => m.XmRadioGroupControlModule),
    },
];
