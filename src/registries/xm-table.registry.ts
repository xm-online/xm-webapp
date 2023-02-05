import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TABLE_ELEMENTS: XmDynamicEntry[] = [
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
        loadChildren: () => import('@xm-ngx/components/table/table/components/cell').then(m => m.EditCellComponent)
    },
    {
        selector: '@xm-ngx/components/edit-chips',
        loadChildren: () => import('@xm-ngx/components/table/table/components/cell').then(m => m.EditChipsComponent)
    },
];
