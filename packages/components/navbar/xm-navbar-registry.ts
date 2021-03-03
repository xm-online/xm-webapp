import { DynamicComponent } from '@xm-ngx/dynamic';

export const XM_NAVBAR_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/navbar-back',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-title',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarTitleModule),
    },
];
