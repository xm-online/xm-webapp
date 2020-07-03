import { DynamicComponents } from '@xm-ngx/dynamic';

export const XM_ELEMENTS: DynamicComponents = [
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
        selector: '@xm-ngx/administration/roles-management-detail',
        loadChildren: () => import('@xm-ngx/administration/roles-management-detail').then(m => m.RolesManagementDetailModule),
    },
    {
        selector: '@xm-ngx/administration/user-management',
        loadChildren: () => import('@xm-ngx/administration/user-management').then(m => m.UserManagementModule),
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
        selector: '@xm-ngx/components/navbar-heatmap-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-heatmap-widget').then(m => m.NavbarHeatmapWidgetModule),
    },
    {
        selector: '@xm-ngx/administration/dashboards-config-widget',
        loadChildren: () => import('@xm-ngx/administration/dashboards-config').then(m => m.DashboardsModule),
    },
    {
        selector: '@xm-ngx/components/navbar-dashboard-edit-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-dashboard-edit-widget').then(m => m.NavbarDashboardEditWidgetModule),
    },
    {
        selector: '@xm-ngx/components/feedback',
        loadChildren: () => import('@xm-ngx/components/feedback').then(m => m.FeedbackModule),
    },
    {
        selector: '@xm-ngx/components/xm-ribbon',
        loadChildren: () => import('@xm-ngx/components/xm-ribbon').then(m => m.XmRibbonModule),
    },
    {
        selector: '@xm-ngx/components/innerHTML',
        loadChildren: () => import('@xm-ngx/components/xm-inner-html-widget.component').then(m => m.InnerHTMLModule),
    },
    {
        selector: '@xm-ngx/components/mat-fab',
        loadChildren: () => import('@xm-ngx/components/mat-fab').then(m => m.MatFabModule),
    },
    {
        selector: '@xm-ngx/components/xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/xm-bool-view').then(m => m.XmBoolViewModule),
    },
    {
        selector: '@xm-ngx/components/xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/xm-bool-control').then(m => m.XmBoolControlModule),
    },
    {
        selector: '@xm-ngx/components/xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/xm-enum-view').then(m => m.XmEnumViewModule),
    },
    {
        selector: '@xm-ngx/components/xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/xm-enum-control').then(m => m.XmEnumControlModule),
    },
    {
        selector: '@xm-ngx/components/xm-text-view',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.XmTextViewModule),
    },
    {
        selector: '@xm-ngx/components/xm-text-control',
        loadChildren: () => import('@xm-ngx/components/xm-text-control').then(m => m.XmTextControlModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-login-widget',
        loadChildren: () => import('@xm-ngx/account/xm-user-login-widget').then(m => m.XmUserLoginWidgetModule),
    },
];
