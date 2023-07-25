import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_DASHBOARD_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/dashboard/default-dashboard',
        loadChildren: () => import('@xm-ngx/dashboard').then(m => m.XmDashboardModule),
    },
    {
        selector: '@xm-ngx/components/sidebar-menu',
        loadChildren: () => import('@xm-ngx/dashboard/menu').then(m => m.MenuComponent),
    },
    {
        selector: '@xm-ngx/components/navbar-user-widget',
        loadChildren: () => import('@xm-ngx/dashboard/navbar-user-widget').then(m => m.NavbarUserWidgetComponent),
    },
];
