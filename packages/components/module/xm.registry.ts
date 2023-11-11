import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_COMPONENTS_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'sidebar-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.LogoComponent),
    },
    {
        selector: 'sidebar-image-logo',
        loadChildren: () => import('@xm-ngx/components/logo').then(m => m.ImageLogoComponent),
    },

    {
        selector: 'breadcrumb',
        loadChildren: () => import('@xm-ngx/components/breadcrumb').then(m => m.XmBreadcrumbComponent),
    },

    {
        selector: 'navbar-heatmap-widget',
        loadChildren: () => import('@xm-ngx/components/navbar-heatmap-widget').then(m => m.NavbarHeatmapWidgetModule),
    },
    {
        selector: 'feedback',
        loadChildren: () => import('@xm-ngx/components/feedback').then(m => m.FeedbackModule),
    },
    {
        selector: 'switch-theme-widget',
        loadChildren: () => import('@xm-ngx/components/switch-theme-widget').then(m => m.SwitchThemeWidgetModule),
    },
    {
        selector: 'xm-ribbon',
        loadChildren: () => import('@xm-ngx/components/ribbon').then(m => m.XmRibbonComponent),
    },
    {
        selector: 'mat-fab',
        loadChildren: () => import('@xm-ngx/components/mat-fab').then(m => m.MatFabModule),
    },
    {
        selector: 'file-control',
        loadChildren: () => import('@xm-ngx/components/file').then(m => m.FileControlModule),
    },
    {
        selector: 'currency-value',
        loadChildren: () => import('@xm-ngx/components/currency').then(m => m.XmCurrencyValueModule),
    },
    {
        selector: 'links-group-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupWidget),
    },
    {
        selector: 'links-group-button-widget',
        loadChildren: () => import('@xm-ngx/components/links-group-widget').then(m => m.LinksGroupButtonWidget),
    },
    {
        selector: 'by-entity-id',
        loadChildren: () => import('@xm-ngx/components/by-entity-id').then(m => m.ByEntityIdModule),
    },
    {
        selector: 'by-entity-id-cell',
        loadChildren: () => import('@xm-ngx/components/by-entity-id').then(m => m.ByEntityIdValueModule),
    },

    {
        selector: 'number-control',
        loadChildren: () => import('@xm-ngx/components/number-control').then(m => m.XmNumberControlModule),
    },
    {
        selector: 'numbers-range-control',
        loadChildren: () => import('@xm-ngx/components/numbers-range-control').then(m => m.NumbersRangeControlModule),
    },
    {
        selector: 'xm-ace-editor-control',
        loadChildren: () => import('@xm-ngx/components/ace-editor').then(m => m.XmAceEditorControl),
    },
    {
        selector: 'multilanguage',
        loadChildren: () => import('@xm-ngx/components/multilanguage').then(m => m.MultiLanguageComponent),
    },
    {
        selector: 'hint-switch',
        loadChildren: () => import('@xm-ngx/components/hint').then(m => m.HintSwitchComponent),
    },
    {
        selector: 'inline-control',
        loadChildren: () => import('@xm-ngx/components/inline-control').then(m => m.XmInlineControlComponent),
    },
    {
        selector: 'user-appearance-theme-widget',
        loadChildren: () => import('@xm-ngx/components/user-appearance-theme-widget').then(m => m.XmUserAppearanceThemeWidget),
    },
    {
        selector: 'edit-widget-buttons',
        loadChildren: () => import('@xm-ngx/components/edit-buttons').then(m => m.EditWidgetButtonsModule),
    },
];
