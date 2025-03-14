import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_LAYOUT_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'card-layout',
        loadChildren: () => import('@xm-ngx/components/layout/card').then(m => m.CardLayoutComponent),
    },
    {
        selector: 'cell-layout',
        loadChildren: () => import('@xm-ngx/components/layout/cell').then(m => m.CellLayoutComponent),
    },
    {
        selector: 'list-layout',
        loadChildren: () => import('@xm-ngx/components/layout/list').then(m => m.ListLayoutComponent),
    },
    {
        selector: 'template-list-layout',
        loadChildren: () => import('@xm-ngx/components/layout/template-list').then(m => m.TemplateListLayoutComponent),
    },
    {
        selector: 'expandable-layout',
        loadChildren: () => import('@xm-ngx/components/layout/expandable').then(m => m.ExpandableLayoutComponent),
    },
    {
        selector: 'editable-layout',
        loadChildren: () => import('@xm-ngx/components/layout/editable').then(m => m.EditableLayoutComponent),
    },
    {
        selector: 'data-layout',
        loadChildren: () => import('@xm-ngx/components/layout/data').then(m => m.DataLayoutComponent),
    },
    {
        selector: 'form-layout',
        loadChildren: () => import('@xm-ngx/components/layout/form').then(m => m.FormLayoutComponent),
    },
];
