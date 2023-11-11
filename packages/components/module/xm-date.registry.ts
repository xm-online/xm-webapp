import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DATE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'date',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/date` instead */
        selector: 'date-value',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateComponent),
    },
    {
        selector: 'date-view',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateView),
    },
    {
        selector: 'date-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateControl),
    },
    {
        selector: 'date-range',
        loadChildren: () => import('@xm-ngx/components/date-range').then(m => m.XmDateRangeComponent),
    },
    {
        selector: 'date-range-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateRangeControl),
    },
    {
        selector: 'date-range-filter-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.DateRangeFilterControl),
    },
    {
        selector: 'datetime-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmDateTimeControlComponent),
    },
    {
        selector: 'string-date-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmStringDateControl),
    },
];
