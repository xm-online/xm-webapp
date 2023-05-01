import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_COMPONENTS_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/sidebar-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.LogoComponent),
    },
    {
        selector: '@xm-ngx/components/sidebar-image-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.ImageLogoComponent),
    },
    {
        selector: '@xm-ngx/components/sidebar-menu',
        loadChildren: () => import('@xm-ngx/components/menu').then(m => m.MenuComponent),
    },
    {
        selector: '@xm-ngx/components/breadcrumb',
        loadChildren: () => import('@xm-ngx/components/breadcrumb').then(m => m.XmBreadcrumbComponent),
    },
    {
        selector: '@xm-ngx/components/navbar-user-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-user-widget').then(m => m.NavbarUserWidgetComponent),
    },
    {
        selector: '@xm-ngx/components/navbar-heatmap-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-heatmap-widget').then(m => m.NavbarHeatmapWidgetModule),
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
        loadChildren: () => import('@xm-ngx/components/ribbon').then(m => m.XmRibbonComponent),
    },
    {
        selector: '@xm-ngx/components/mat-fab',
        loadChildren: () => import('@xm-ngx/components/mat-fab').then(m => m.MatFabModule),
    },
    {
        selector: '@xm-ngx/components/file-control',
        loadChildren: () => import('@xm-ngx/components/file').then(m => m.FileControlModule),
    },
    {
        selector: '@xm-ngx/components/currency-value',
        loadChildren: () => import('@xm-ngx/components/currency').then(m => m.XmCurrencyValueModule),
    },
    {
        selector: '@xm-ngx/components/links-group-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupWidget),
    },
    {
        selector: '@xm-ngx/components/links-group-button-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupButtonWidget),
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
        selector: '@xm-ngx/account/xm-user-login-widget',
        loadChildren: () => import('@xm-ngx/account/user-login-widget').then(m => m.XmUserLoginWidgetComponent),
    },
    {
        selector: '@xm-ngx/account/xm-user-security-settings',
        loadChildren: () => import('@xm-ngx/account/user-security-settings').then(m => m.XmUserSecuritySettingsComponent),
    },
    {
        selector: '@xm-ngx/account/xm-user-settings-widget',
        loadChildren: () => import('@xm-ngx/account/user-settings-widget').then(m => m.XmUserSettingsWidgetComponent),
    },
    {
        selector: '@xm-ngx/account/xm-user-password-widget',
        loadChildren: () => import('@xm-ngx/account/user-password-widget').then(m => m.XmUserPasswordWidgetComponent),
    },
    {
        selector: '@xm-ngx/components/number-control',
        loadChildren: () => import('@xm-ngx/components/number-control').then(m => m.XmNumberControlModule),
    },
    {
        selector: '@xm-ngx/components/numbers-range-control',
        loadChildren: () => import('@xm-ngx/components/numbers-range-control').then(m => m.NumbersRangeControlModule),
    },
    {
        selector: '@xm-ngx/documentation/examples',
        loadChildren: () => import('../documentation/doc-examples/xm-doc-examples.module').then(m => m.XmDocExamplesModule),
    },
    {
        selector: '@xm-ngx/components/xm-ace-editor-control',
        loadChildren: () => import('@xm-ngx/components/ace-editor').then(m => m.XmAceEditorControl),
    },
    {
        selector: '@xm-ngx/components/multilanguage',
        loadChildren: () => import('@xm-ngx/components/multilanguage').then(m => m.MultiLanguageComponent),
    },
    {
        selector: '@xm-ngx/components/hint-switch',
        loadChildren: () => import('@xm-ngx/components/hint/hint-switch/hint-switch.component').then(m => m.HintSwitchComponent),
    },
    {
        selector: '@xm-ngx/components/inline-control',
        loadChildren: () => import('@xm-ngx/components/inline-control/inline-control.component').then(m => m.XmInlineControlComponent),
    },
    {
        selector: '@xm-ngx/components/user-appearance-theme-widget',
        loadChildren: () => import('@xm-ngx/components/user-appearance-theme-widget').then(m => m.XmUserAppearanceThemeWidget),
    },
];
