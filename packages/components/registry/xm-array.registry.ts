import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ARRAY_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/array-control',
        loadChildren: () => import('@xm-ngx/components/array-control').then(m => m.XmArrayControl),
    },
    {
        selector: '@xm-ngx/components/autocomplete-control',
        loadChildren: () => import('@xm-ngx/components/autocomplete-control').then(m => m.XmAutocompleteControlComponent),
    },
    {
        selector: '@xm-ngx/components/autocomplete-table-control',
        loadChildren: () => import('@xm-ngx/components/autocomplete-control').then(m => m.XmAutocompleteTableControl),
    },
];
