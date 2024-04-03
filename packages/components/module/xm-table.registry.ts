import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TABLE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'entity-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmEntityRepository),
    },
    {
        selector: 'elastic-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmElasticSearchRepository),
    },
    {
        selector: 'http-repository',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmHttpRepository),
    },
    {
        selector: 'table-array',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableArrayComponent),
    },
    {
        selector: 'table',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableWidget),
    },
    {
        selector: 'table-edit-cell',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableEditCellComponent),
    },
    {
        selector: 'edit-chips',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableFilterChipsControlComponent),
    },
    {
        selector: 'table-widget',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableWidget),
    },
    {
        selector: 'chips-control',
        loadChildren: () => import('@xm-ngx/components/chips-control').then(m => m.ChipsControlComponent),
    },
    {
        selector: 'table/collections/table-linked',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableLinkedCollectionController),
    },
    {
        selector: 'table-array-collection-controller',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableArrayCollectionController),
    },
    {
        selector: 'table-string-array-collection-controller',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableStringArrayCollectionController),
    },
    {
        selector: 'table-request-builder',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmElasticRequestBuilder),
    },
    {
        selector: 'table-repository-collection-controller',
        loadChildren: () => import('@xm-ngx/components/table').then(m => m.XmTableRepositoryCollectionController),
    },
];
