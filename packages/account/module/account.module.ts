import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: 'xm-user-login-widget',
                loadChildren: () => import('@xm-ngx/account/user-login-widget').then(m => m.XmUserLoginWidgetModule),
            },
            {
                selector: 'xm-user-security-settings',
                loadChildren: () => import('@xm-ngx/account/user-security-settings').then(m => m.XmUserSecuritySettingsModule),
            },
            {
                selector: 'xm-user-settings-widget',
                loadChildren: () => import('@xm-ngx/account/user-settings-widget').then(m => m.XmUserSettingsWidgetModule),
            },
            {
                selector: 'xm-user-password-widget',
                loadChildren: () => import('@xm-ngx/account/user-password-widget').then(m => m.XmUserPasswordWidgetModule),
            },
        ]),
    ],
})
export class AccountModule {
}
