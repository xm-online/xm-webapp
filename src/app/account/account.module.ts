import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '@xm-ngx/components/language';
import { MarkdownModule } from 'ngx-markdown';

import { XmUserLoginWidgetModule } from '../../../packages/xm-account/src/xm-user-login-widget/xm-user-login-widget.module';
import { XmUserSecuritySettingsModule } from '../../../packages/xm-account/src/xm-user-security-settings/xm-user-security-settings.module';
import { XmUserSettingsWidgetModule } from '../../../packages/xm-account/src/xm-user-settings-widget/xm-user-settings-widget.module';

import { XmSharedModule } from '../shared/shared.module';
import {
    Activate,
    ActivateComponent,
    HelpComponent,
    Password,
    PasswordResetFinish,
    PasswordResetFinishComponent,
    PasswordResetInit,
    PasswordResetInitComponent,
    SettingsComponent,
    SignUpComponent,
    SocialAuthComponent,
    SocialRegisterComponent,
} from './';
import { accountState } from './account.route';
import { LogoutComponent } from './logout/logout.component';
import { PasswordModule } from './password/password.module';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';


@NgModule({
    imports: [
        PasswordModule,
        XmSharedModule,
        RouterModule.forChild(accountState),
        LanguageModule,
        XmUserSettingsWidgetModule,
        XmUserSecuritySettingsModule,
        XmUserLoginWidgetModule,
        MarkdownModule,
    ],
    declarations: [
        SocialRegisterComponent,
        SocialAuthComponent,
        ActivateComponent,
        SignUpComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        LogoutComponent,
        HelpComponent,
        PasswordSettingsComponent,
    ],
    providers: [
        Activate,
        Password,
        PasswordResetInit,
        PasswordResetFinish,
    ],
})
export class GateAccountModule {
}
