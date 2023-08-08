import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_LAYOUT_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/card-layout',
        loadChildren: () => import('@xm-ngx/components/layout/card').then(m => m.CardLayoutComponent),
    },
    {
        selector: '@xm-ngx/components/list-layout',
        loadChildren: () => import('@xm-ngx/components/layout/list').then(m => m.ListLayoutComponent),
    },
    {
        selector: '@xm-ngx/components/expandable-layout',
        loadChildren: () => import('packages/components/layout/expandable').then(m => m.ExpandableLayoutComponent),
    },
    {
        selector: '@xm-ngx/components/editable-layout',
        loadChildren: () => import('packages/components/layout/editable').then(m => m.EditableLayoutComponent),
    },
    {
        selector: '@xm-ngx/components/data-layout',
        loadChildren: () => import('packages/components/layout/data').then(m => m.DataLayoutComponent),
    },
    {
        selector: '@xm-ngx/components/form-layout',
        loadChildren: () => import('packages/components/layout/form').then(m => m.FormLayoutComponent),
    },
];
