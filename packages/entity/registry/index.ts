import { XmDynamicEntries } from '@xm-ngx/dynamic';

export const XM_ENTITY_ELEMENTS: XmDynamicEntries = [
    {
        selector: '@xm-ngx/components/navbar-search-widget',
        loadChildren: () => import('@xm-ngx/entity/search').then(m => m.XmNavbarSearchWidget),
    },
    {
        selector: '@xm-ngx/components/application-table-menu',
        loadChildren: () => import('@xm-ngx/entity/src/entity-list-card').then(m => m.XmEntityTableMenuComponent),
    },
    {
        selector: '@xm-ngx/components/application-table-state',
        loadChildren: () => import('@xm-ngx/entity/src/entity-list-card').then(m => m.XmEntityTableStateComponent),
    },
    {
        selector: '@xm-ngx/components/application-table-delete-button',
        loadChildren: () => import('@xm-ngx/entity/src/entity-list-card').then(m => m.XmEntityTableDeleteButtonComponent),
    },
    {
        selector: '@xm-ngx/components/application-table-actions',
        loadChildren: () => import('@xm-ngx/entity/src/entity-list-card').then(m => m.XmEntityTableActionsComponent),
    },
    {
        selector: '@xm-ngx/components/application-table-link',
        loadChildren: () => import('@xm-ngx/entity/src/entity-list-card').then(m => m.XmEntityTableLinkComponent),
    },
];
