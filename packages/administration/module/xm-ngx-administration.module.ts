import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: 'audits',
                loadChildren: () => import('@xm-ngx/administration/audits').then(m => m.AuditsModule),
            },
            {
                selector: 'docs',
                loadChildren: () => import('@xm-ngx/administration/docs').then(m => m.DocsModule),
            },
            {
                selector: 'form-playground',
                loadChildren: () => import('@xm-ngx/administration/form-playground').then(m => m.FormPlaygroundModule),
            },
            {
                selector: 'gateway',
                loadChildren: () => import('@xm-ngx/administration/gateway').then(m => m.GatewayModule),
            },
            {
                selector: 'health',
                loadChildren: () => import('@xm-ngx/administration/health').then(m => m.HealthModule),
            },
            {
                selector: 'architecture',
                loadChildren: () => import('@xm-ngx/administration/architecture').then(m => m.HighLevelArchitectureWidgetModule),
            },
            {
                selector: 'logs',
                loadChildren: () => import('@xm-ngx/administration/logs').then(m => m.LogsModule),
            },
            {
                selector: 'maintenance',
                loadChildren: () => import('@xm-ngx/administration/maintenance').then(m => m.MaintenanceModule),
            },
            {
                selector: 'roles-matrix',
                loadChildren: () => import('@xm-ngx/administration/roles-matrix').then(m => m.RolesMatrixModule),
            },
            {
                selector: 'metrics',
                loadChildren: () => import('@xm-ngx/administration/metrics').then(m => m.MetricModule),
            },
            {
                selector: 'translations',
                loadChildren: () => import('@xm-ngx/administration/translations').then(m => m.TranslationModule),
            },
            {
                selector: 'client-management',
                loadChildren: () => import('@xm-ngx/administration/client-management').then(m => m.ClientManagementModule),
            },
            {
                selector: 'roles-management',
                loadChildren: () => import('@xm-ngx/administration/roles-management').then(m => m.RolesManagementModule),
            },
            {
                selector: 'style-guide',
                loadChildren: () => import('@xm-ngx/administration/style-guide').then(m => m.StyleGuideModule),
            },
            {
                selector: 'roles-management-detail',
                loadChildren: () => import('@xm-ngx/administration/roles-management-detail').then(m => m.RolesManagementDetailModule),
            },
            {
                selector: 'user-management',
                loadChildren: () => import('@xm-ngx/administration/user-management').then(m => m.UserManagementModule),
            },
            {
                selector: 'user-management/unblock-lock-user',
                loadChildren: () => import('@xm-ngx/administration/user-management').then(m => m.UnblockLockUserModule),
            },
            {
                selector: 'user-management-detail',
                loadChildren: () => import('@xm-ngx/administration/user-management-detail').then(m => m.UserManagementDetailModule),
            },
            {
                selector: 'specification-management',
                loadChildren: () => import('@xm-ngx/administration/specification-management').then(m => m.SpecificationManagementModule),
            },
            {
                selector: 'dashboards-config-widget',
                loadChildren: () => import('@xm-ngx/administration/dashboards-config').then(m => m.DashboardsModule),
            },
            {
                selector: '@xm-ngx/components/navbar-dashboard-edit-widget',
                loadChildren: () => import('@xm-ngx/administration/navbar-dashboard-edit-widget').then(m => m.NavbarDashboardEditWidgetComponent),
            },
            {
                selector: '@xm-ngx/components/dynamic-list-widget',
                loadChildren: () => import('@xm-ngx/administration').then(m => m.XmDynamicListModule),
            },
            {
                selector: '@xm-ngx/components/navbar-language-menu-widget',
                loadChildren: () => import('@xm-ngx/administration/language-menu').then(m => m.XmNavbarLanguageMenuWidget),
            },
        ]),
    ],
})
export class XmNgxAdministrationModule {
}
