import { XmDynamicEntries } from '@xm-ngx/dynamic';

export default [
    {
        selector: '@xm-ngx/components/navbar-search-widget',
        loadChildren: () => import('@xm-ngx/entity/search').then(m => m.XmNavbarSearchWidget),
    },
] as XmDynamicEntries;
