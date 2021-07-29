import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_NAVBAR_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/navbar-arrow-back-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-help-link-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarHelpLinkWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-language-menu-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLanguageMenuWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-logo-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLogoWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-search-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarSearchWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-title-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarTitleWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-toggle-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarToggleWidgetModule),
    },
];
