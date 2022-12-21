import { XmDynamicEntries } from '@xm-ngx/dynamic';
import { XM_DATE_ELEMENTS } from './xm-date.registry';
import { XM_HTML_ELEMENTS } from './xm-html.registry';
import { XM_TEXT_ELEMENTS } from './xm-text.registry';
import { XM_COPY_ELEMENTS } from './xm-copy.registry';
import { XM_LINK_ELEMENTS } from './xm-link.registry';
import { XM_ENUM_ELEMENTS } from './xm-enum.registry';
import { XM_BOOL_ELEMENTS } from './xm-bool.registry';
import { XM_ARRAY_ELEMENTS } from './xm-array.registry';
import { XM_TABLE_ELEMENTS } from './xm-table.registry';
import { XM_NAVBAR_ELEMENTS } from './xm-navbar.registry';
import { XM_DASHBOARD_ELEMENTS } from './xm-dashboard.registry';
import { XM_ADMINISTRATION_ELEMENTS } from './xm-administration.registry';

export const XM_ELEMENTS: XmDynamicEntries = [
    ...XM_DATE_ELEMENTS,
    ...XM_HTML_ELEMENTS,
    ...XM_TEXT_ELEMENTS,
    ...XM_BOOL_ELEMENTS,
    ...XM_COPY_ELEMENTS,
    ...XM_LINK_ELEMENTS,
    ...XM_ENUM_ELEMENTS,
    ...XM_ARRAY_ELEMENTS,
    ...XM_TABLE_ELEMENTS,
    ...XM_NAVBAR_ELEMENTS,
    ...XM_DASHBOARD_ELEMENTS,
    ...XM_ADMINISTRATION_ELEMENTS,
    {
        selector: '@xm-ngx/components/sidebar-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.XmLogoModule),
    },
    {
        selector: '@xm-ngx/components/sidebar-image-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.ImageLogoModule),
    },
    {
        selector: '@xm-ngx/components/sidebar-menu',
        loadChildren: () => import('@xm-ngx/components/menu').then(m => m.XmMenuModule),
    },
    {
        selector: '@xm-ngx/components/breadcrumb',
        loadChildren: () => import('@xm-ngx/components/breadcrumb').then(m => m.XmBreadcrumbModule),
    },
    {
        selector: '@xm-ngx/components/navbar-user-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-user-widget').then(m => m.NavbarUserWidgetModule),
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
        loadChildren: () => import('@xm-ngx/components/ribbon').then(m => m.XmRibbonModule),
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
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupWidgetModule),
    },
    {
        selector: '@xm-ngx/components/links-group-button-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupButtonWidgetModule),
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
        loadChildren: () => import('@xm-ngx/account/user-login-widget').then(m => m.XmUserLoginWidgetModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-security-settings',
        loadChildren: () => import('@xm-ngx/account/user-security-settings').then(m => m.XmUserSecuritySettingsModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-settings-widget',
        loadChildren: () => import('@xm-ngx/account/user-settings-widget').then(m => m.XmUserSettingsWidgetModule),
    },
    {
        selector: '@xm-ngx/account/xm-user-password-widget',
        loadChildren: () => import('@xm-ngx/account/user-password-widget').then(m => m.XmUserPasswordWidgetModule),
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
        loadChildren: () => import('../../packages/documentation/doc-examples/xm-doc-examples.module').then(m => m.XmDocExamplesModule),
    },
    {
        selector: '@xm-ngx/components/xm-ace-editor-control',
        loadChildren: () => import('@xm-ngx/components/ace-editor').then(m => m.XmAceEditorControlModule),
    },
    {
        selector: '@xm-ngx/components/multilanguage',
        loadChildren: () => import('@xm-ngx/components/multilanguage').then(m => m.MultiLanguageModule),
    },
    {
        selector: '@xm-ngx/components/hint-switch',
        loadChildren: () => import('@xm-ngx/components/hint/hint-switch/hint-switch.module').then(m => m.HintSwitchModule),
    },
];
