import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DATE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/date',
        loadChildren: () => import('@xm-ngx/components/date/xm-date.component').then(m => m.XmDateComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/date` instead */
        selector: '@xm-ngx/components/date-value',
        loadChildren: () => import('@xm-ngx/components/date/xm-date.component').then(m => m.XmDateComponent),
    },
    {
        selector: '@xm-ngx/components/date-view',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-view').then(m => m.XmDateView),
    },
    {
        selector: '@xm-ngx/components/date-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-control').then(m => m.XmDateControl),
    },
    {
        selector: '@xm-ngx/components/date-range-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-range-control').then(m => m.XmDateRangeControl),
    },
    {
        selector: '@xm-ngx/components/date-range-filter-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-date-range-filter-control').then(m => m.DateRangeFilterControl),
    },
    {
        selector: '@xm-ngx/components/datetime-control',
        loadChildren: () => import('@xm-ngx/components/date/xm-datetime-control').then(m => m.XmDateTimeControlComponent),
    },
    {
        selector: '@xm-ngx/components/string-date-control',
        loadChildren: () => import('@xm-ngx/components/date').then(m => m.XmStringDateControl),
    },
];
