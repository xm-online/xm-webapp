import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: '@xm-ngx/dashboard/default-dashboard',
                loadChildren: () => import('@xm-ngx/dashboard').then(m => m.XmDashboardModule),
            },
            {
                selector: '@xm-ngx/components/sidebar-menu',
                loadChildren: () => import('@xm-ngx/dashboard/menu').then(m => m.MenuComponent),
            },
            {
                selector: '@xm-ngx/components/navbar-user-widget',
                loadChildren: () => import('@xm-ngx/dashboard/navbar-user-widget').then(m => m.NavbarUserWidgetComponent),
            },
        ]),
    ],
})
export class XmNgxDashboardModule {
}
