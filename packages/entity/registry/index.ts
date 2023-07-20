import { XmDynamicEntries } from '@xm-ngx/dynamic';

export const XM_ENTITY_ELEMENTS: XmDynamicEntries = [
    {
        selector: '@xm-ngx/components/navbar-search-widget',
        loadChildren: () => import('@xm-ngx/entity/search').then(m => m.XmNavbarSearchWidget),
    },
];
