import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DATE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/date',
        loadChildren: () => import('./xm-date.component').then(m => m.XmDateModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/date` instead */
        selector: '@xm-ngx/components/date-value',
        loadChildren: () => import('./xm-date.component').then(m => m.XmDateModule),
    },
    {
        selector: '@xm-ngx/components/date-view',
        loadChildren: () => import('./xm-date-view').then(m => m.XmDateViewModule),
    },
    {
        selector: '@xm-ngx/components/date-control',
        loadChildren: () => import('./xm-date-control').then(m => m.XmDateControlModule),
    },
    {
        selector: '@xm-ngx/components/date-range-control',
        loadChildren: () => import('./xm-date-range-control').then(m => m.XmDateRangeControlModule),
    },
    {
        selector: '@xm-ngx/components/datetime-control',
        loadChildren: () => import('./xm-datetime-control').then(m => m.XmDatetimeControlModule),
    },
];
