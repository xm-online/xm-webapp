import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_NAVBAR_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'navbar-arrow-back-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidget),
    },
    {
        selector: 'navbar-help-link-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarHelpLinkWidget),
    },
    {
        selector: 'navbar-logo-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarLogoWidget),
    },

    {
        selector: 'navbar-title-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarTitleWidget),
    },
    {
        selector: 'navbar-toggle-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarToggleWidget),
    },
];
