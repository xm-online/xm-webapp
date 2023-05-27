import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_NAVBAR_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/navbar-arrow-back-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-help-link-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarHelpLinkWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-language-menu-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLanguageMenuWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-logo-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLogoWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-search-widget',
        loadChildren: () => import('packages/entity/search/xm-navbar-search-widget.component').then(m => m.XmNavbarSearchWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-title-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarTitleWidget),
    },
    {
        selector: '@xm-ngx/components/navbar-toggle-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarToggleWidget),
    },
];
