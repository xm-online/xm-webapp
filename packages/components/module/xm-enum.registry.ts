import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ENUM_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum` instead */
        selector: 'enum-value',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumComponent),
    },

    {
        selector: 'enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumView),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-view` instead */
        selector: 'xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumView),
    },
    {
        selector: 'enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/enum-control` instead */
        selector: 'xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControl),
    },
    {
        selector: 'multiple-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmMultipleEnumControl),
    },
    {
        selector: 'icon-enum',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmIconEnumComponent),
    },
    {
        selector: 'radio-group-control',
        loadChildren: () => import('@xm-ngx/components/radio-group').then(m => m.XmRadioGroupControlModule),
    },
    {
        selector: 'multi-select',
        loadChildren: () => import('@xm-ngx/components/multi-select').then(m => m.XmMultiSelectControlModule),
    },
];
