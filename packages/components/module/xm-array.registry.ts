import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ARRAY_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'array-control',
        loadChildren: () => import('@xm-ngx/components/array-control').then(m => m.XmArrayControl),
    },
    {
        selector: 'key-filter',
        loadChildren: () => import('@xm-ngx/components/key-filter').then(m => m.XmKeyFilterComponent),
    },
    {
        selector: 'autocomplete-control',
        loadChildren: () => import('@xm-ngx/components/autocomplete-control').then(m => m.XmAutocompleteControlComponent),
    },
    {
        selector: 'autocomplete-table-control',
        loadChildren: () => import('@xm-ngx/components/autocomplete-control').then(m => m.XmAutocompleteTableControl),
    },
    {
        selector: 'autocomplete-chips-control',
        loadChildren: () => import('@xm-ngx/components/autocomplete-control').then(m => m.XmAutocompleteChipsControlComponent),
    },
];
