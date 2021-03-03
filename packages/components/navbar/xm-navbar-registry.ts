import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XmNavbarTitleWidgetModule } from '@xm-ngx/components/navbar/title/xm-navbar-title-widget.module';

export const XM_NAVBAR_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/navbar-arrow-back-widget',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => m.XmNavbarArrowBackWidgetModule),
    },
    {
        selector: '@xm-ngx/components/navbar-title',
        loadChildren: () => import('@xm-ngx/components/navbar').then(m => XmNavbarTitleWidgetModule),
    },
];
