import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '@xm-ngx/translation';
import { MarkdownModule } from 'ngx-markdown';

import { XmSharedModule } from '@xm-ngx/shared';
import { accountState } from './account.route';
import { ActivateComponent } from '../activate/activate.component';
import { Activate } from '../activate/activate.service';
import { HelpComponent } from '../help/help.component';
import { LogoutComponent } from '../logout/logout.component';
import { PasswordResetFinishComponent } from '../password-reset/finish/password-reset-finish.component';
import { PasswordResetFinish } from '../password-reset/finish/password-reset-finish.service';
import { PasswordResetInitComponent } from '../password-reset/init/password-reset-init.component';
import { PasswordResetInit } from '../password-reset/init/password-reset-init.service';
import { PasswordModule } from '../password/password.module';
import { PasswordSettingsComponent } from '../password-settings/password-settings.component';
import { IdpCallbackComponent } from '../idp-callback/idp-callback.component';
import { LoginErrorComponent } from '../login-error/login-error.component';
import { Password } from '../password/password.service';
import { SettingsComponent } from '../settings/settings.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { XmUserSettingsWidgetComponent } from '../user-settings-widget';
import { XmUserSecuritySettingsComponent } from '../user-security-settings';
import { XmUserLoginWidgetComponent } from '../user-login-widget';


@NgModule({
    imports: [
        PasswordModule,
        XmSharedModule,
        RouterModule.forChild(accountState),
        LanguageModule,
        XmUserSettingsWidgetComponent,
        XmUserSecuritySettingsComponent,
        XmUserLoginWidgetComponent,
        MarkdownModule,
    ],
    declarations: [
        ActivateComponent,
        SignUpComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        LogoutComponent,
        HelpComponent,
        PasswordSettingsComponent,
        IdpCallbackComponent,
        LoginErrorComponent,
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
