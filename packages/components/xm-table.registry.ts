import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TABLE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/entity-repository',
        loadChildren: () => import('@xm-ngx/components/table/repositories/xm-entity-repository.service').then(m => m.XmEntityRepository),
    },
    {
        selector: '@xm-ngx/components/elastic-repository',
        loadChildren: () => import('@xm-ngx/components/table/repositories/xm-elastic-search-repository.service').then(m => m.XmElasticSearchRepository),
    },
    {
        selector: '@xm-ngx/components/http-repository',
        loadChildren: () => import('@xm-ngx/components/table/repositories/xm-http-repository.service').then(m => m.XmHttpRepository),
    },
    {
        selector: '@xm-ngx/components/table-array',
        loadChildren: () => import('@xm-ngx/components/table/table-array').then(m => m.XmTableArrayModule),
    },
    {
        selector: '@xm-ngx/components/table',
        loadChildren: () => import('@xm-ngx/components/table/table/xm-table.component').then(m => m.XmTableComponent)
    },
    {
        selector: '@xm-ngx/components/table-edit-cell',
        loadChildren: () => import('@xm-ngx/components/table/components/xm-table-edit-cell.component').then(m => m.XmTableEditCellComponent)
    },
    {
        selector: '@xm-ngx/components/edit-chips',
        loadChildren: () => import('@xm-ngx/components/table/components/xm-table-control.component').then(m => m.XmTableControlComponent)
    },
    {
        selector: '@xm-ngx/components/chips-control',
        loadChildren: () => import('@xm-ngx/components/table/components/chips-control/chips-control.component').then(m => m.ChipsControlComponent)
    },
];
