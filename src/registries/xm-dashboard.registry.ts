import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DASHBOARD_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/dashboard/default-dashboard',
        loadChildren: () => import('@xm-ngx/dashboard').then(m => m.XmDashboardModule),
    }
];
