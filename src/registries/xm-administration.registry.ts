import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ADMINISTRATION_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/administration/audits',
        loadChildren: () => import('@xm-ngx/administration/audits').then(m => m.AuditsModule),
    },
    {
        selector: '@xm-ngx/administration/docs',
        loadChildren: () => import('@xm-ngx/administration/docs').then(m => m.DocsModule),
    },
    {
        selector: '@xm-ngx/administration/form-playground',
        loadChildren: () => import('@xm-ngx/administration/form-playground').then(m => m.FormPlaygroundModule),
    },
    {
        selector: '@xm-ngx/administration/gateway',
        loadChildren: () => import('@xm-ngx/administration/gateway').then(m => m.GatewayModule),
    },
    {
        selector: '@xm-ngx/administration/health',
        loadChildren: () => import('@xm-ngx/administration/health').then(m => m.HealthModule),
    },
    {
        selector: '@xm-ngx/administration/architecture',
        loadChildren: () => import('@xm-ngx/administration/architecture').then(m => m.HighLevelArchitectureWidgetModule),
    },
    {
        selector: '@xm-ngx/administration/logs',
        loadChildren: () => import('@xm-ngx/administration/logs').then(m => m.LogsModule),
    },
    {
        selector: '@xm-ngx/administration/maintenance',
        loadChildren: () => import('@xm-ngx/administration/maintenance').then(m => m.MaintenanceModule),
    },
    {
        selector: '@xm-ngx/administration/roles-matrix',
        loadChildren: () => import('@xm-ngx/administration/roles-matrix').then(m => m.RolesMatrixModule),
    },
    {
        selector: '@xm-ngx/administration/metrics',
        loadChildren: () => import('@xm-ngx/administration/metrics').then(m => m.MetricModule),
    },
    {
        selector: '@xm-ngx/administration/translations',
        loadChildren: () => import('@xm-ngx/administration/translations').then(m => m.TranslationModule),
    },
    {
        selector: '@xm-ngx/administration/client-management',
        loadChildren: () => import('@xm-ngx/administration/client-management').then(m => m.ClientManagementModule),
    },
    {
        selector: '@xm-ngx/administration/roles-management',
        loadChildren: () => import('@xm-ngx/administration/roles-management').then(m => m.RolesManagementModule),
    },
    {
        selector: '@xm-ngx/administration/style-guide',
        loadChildren: () => import('@xm-ngx/administration/style-guide').then(m => m.StyleGuideModule),
    },
    {
        selector: '@xm-ngx/administration/roles-management-detail',
        loadChildren: () => import('@xm-ngx/administration/roles-management-detail').then(m => m.RolesManagementDetailModule),
    },
    {
        selector: '@xm-ngx/administration/user-management',
        loadChildren: () => import('@xm-ngx/administration/user-management').then(m => m.UserManagementModule),
    },
    {
        selector: '@xm-ngx/administration/user-management/unblock-lock-user',
        loadChildren: () => import('@xm-ngx/administration/user-management/unblock-lock-user/unblock-lock-user.module').then(m => m.UnblockLockUserModule),
    },
    {
        selector: '@xm-ngx/administration/user-management-detail',
        loadChildren: () => import('@xm-ngx/administration/user-management-detail').then(m => m.UserManagementDetailModule),
    },
    {
        selector: '@xm-ngx/administration/specification-management',
        loadChildren: () => import('@xm-ngx/administration/specification-management').then(m => m.SpecificationManagementModule),
    },
    {
        selector: '@xm-ngx/administration/dashboards-config-widget',
        loadChildren: () => import('@xm-ngx/administration/dashboards-config').then(m => m.DashboardsModule),
    },
    {
        selector: '@xm-ngx/components/navbar-dashboard-edit-widget',
        loadChildren: () => import('@xm-ngx/administration/navbar-dashboard-edit-widget').then(m => m.NavbarDashboardEditWidgetModule),
    },
    {
        selector: '@xm-ngx/components/dynamic-list-widget',
        loadChildren: () => import('@xm-ngx/administration/xm-dynamic-list.module').then(m => m.XmDynamicListModule),
    },
];
