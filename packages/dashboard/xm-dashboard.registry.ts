import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DASHBOARD_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/dashboard/default-dashboard',
        loadChildren: () => import('packages/dashboard/index').then(m => m.XmDashboardModule),
    }
];
