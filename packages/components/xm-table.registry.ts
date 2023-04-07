import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XmTableControlComponent } from '@xm-ngx/components/table/table/components/xm-table-control.component';

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
        loadChildren: () => import('@xm-ngx/components/table/table/components/xm-table-edit-cell.component').then(m => m.XmTableEditCellComponent)
    },
    {
        selector: '@xm-ngx/components/edit-chips',
        loadChildren: () => import('@xm-ngx/components/table/table/components/xm-table-edit-cell.component').then(m => XmTableControlComponent)
    },
    {
        selector: '@xm-ngx/components/chips-control',
        loadChildren: () => import('@xm-ngx/components/table/table/components/chips-control/chips-control.component').then(m => m.ChipsControlComponent)
    },
];
