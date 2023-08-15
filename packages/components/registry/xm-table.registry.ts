import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TABLE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/entity-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmEntityRepository),
    },
    {
        selector: '@xm-ngx/components/elastic-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmElasticSearchRepository),
    },
    {
        selector: '@xm-ngx/components/http-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmHttpRepository),
    },
    {
        selector: '@xm-ngx/components/table-array',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableArrayComponent),
    },
    {
        selector: '@xm-ngx/components/table',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableWidget),
    },
    {
        selector: '@xm-ngx/components/table-edit-cell',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableEditCellComponent),
    },
    {
        selector: '@xm-ngx/components/edit-chips',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableFilterChipsControlComponent),
    },
    {
        selector: '@xm-ngx/components/table-widget',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableWidget),
    },
    {
        selector: '@xm-ngx/components/chips-control',
        loadChildren: () => import('@xm-ngx/components/chips-control').then(m => m.ChipsControlComponent),
    },
    {
        selector: '@xm-ngx/collection/table-linked',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableLinkedCollectionController),
    },
];
