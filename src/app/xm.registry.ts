import { XM_DATE_ELEMENTS } from '@xm-ngx/components/date';
import { XM_HTML_ELEMENTS } from '@xm-ngx/components/html';
import { DynamicComponents } from '@xm-ngx/dynamic';

export const XM_ELEMENTS: DynamicComponents = [
    ...XM_DATE_ELEMENTS,
    ...XM_HTML_ELEMENTS,
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
        selector: '@xm-ngx/components/switch-theme-widget',
        loadChildren: () => import('@xm-ngx/components/switch-theme-widget').then(m => m.SwitchThemeWidgetModule),
    },
    {
        selector: '@xm-ngx/components/xm-ribbon',
        loadChildren: () => import('@xm-ngx/components/xm-ribbon').then(m => m.XmRibbonModule),
    },
    {
        selector: '@xm-ngx/components/mat-fab',
        loadChildren: () => import('@xm-ngx/components/mat-fab').then(m => m.MatFabModule),
    },
    {
        selector: '@xm-ngx/components/copy',
        loadChildren: () => import('@xm-ngx/components/copy').then(m => m.CopyIconModule),
    },
    {
        selector: '@xm-ngx/components/currency-value',
        loadChildren: () => import('@xm-ngx/components/currency').then(m => m.XmCurrencyValueModule),
    },
    {
        selector: '@xm-ngx/components/xm-bool-view',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.BoolValueModule),
    },
    {
        selector: '@xm-ngx/components/xm-bool-control',
        loadChildren: () => import('@xm-ngx/components/bool').then(m => m.XmBoolControlModule),
    },
    {
        selector: '@xm-ngx/components/xm-enum-view',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumViewModule),
    },
    {
        selector: '@xm-ngx/components/enum-value',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumValueModule),
    },
    {
        selector: '@xm-ngx/components/links-group-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupWidgetModule),
    },
    {
        selector: '@xm-ngx/components/links-group-button-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupButtonWidgetModule),
    },
    {
        selector: '@xm-ngx/components/xm-enum-control',
        loadChildren: () => import('@xm-ngx/components/enum').then(m => m.XmEnumControlModule),
    },
    {
        selector: '@xm-ngx/components/text-value',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.TextValueModule),
    },
    {
        selector: '@xm-ngx/components/text-join-value',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.TextJoinValueModule),
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
        selector: '@xm-ngx/components/by-entity-id',
        loadChildren: () => import('@xm-ngx/components/by-entity-id').then(m => m.ByEntityIdModule),
    },
    {
        selector: '@xm-ngx/components/by-entity-id-cell',
        loadChildren: () => import('@xm-ngx/components/by-entity-id/by-entity-id-value.component').then(m => m.ByEntityIdValueModule),
    },
    {
        selector: '@xm-ngx/components/link-value',
        loadChildren: () => import('@xm-ngx/components/xm-link-view').then(m => m.LinkValueModule),
    },
    {
        selector: '@xm-ngx/components/xm-link-view',
        loadChildren: () => import('@xm-ngx/components/xm-link-view').then(m => m.XmLinkViewModule),
    },
    {
        selector: '@xm-ngx/components/xm-link-copy',
        loadChildren: () => import('@xm-ngx/components/xm-link-view').then(m => m.XmLinkViewCopyModule),
    },
    {
        selector: '@xm-ngx/components/text-range',
        loadChildren: () => import('@xm-ngx/components/text-range').then(m => m.XmTextRangeModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-login-widget',
        loadChildren: () => import('@xm-ngx/account/xm-user-login-widget').then(m => m.XmUserLoginWidgetModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-security-settings',
        loadChildren: () => import('@xm-ngx/account/xm-user-security-settings').then(m => m.XmUserSecuritySettingsModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-settings-widget',
        loadChildren: () => import('@xm-ngx/account/xm-user-settings-widget').then(m => m.XmUserSettingsWidgetModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-password-widget',
        loadChildren: () => import('@xm-ngx/account/xm-user-password-widget').then(m => m.XmUserPasswordWidgetModule),
    },
    {
        selector: '@xm-ngx/components/number-control',
        loadChildren: () => import('@xm-ngx/components/number-control').then(m => m.XmNumberControlModule),
    },
    {
        selector: '@xm-ngx/components/checkbox-control',
        loadChildren: () => import('@xm-ngx/components/checkbox-control').then(m => m.XmCheckboxControlModule),
    },
];
