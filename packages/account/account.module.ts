import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '@xm-ngx/translation';
import { MarkdownModule } from 'ngx-markdown';

import { XmSharedModule } from '@xm-ngx/shared';
import { accountState } from './route/account.route';
import { ActivateComponent } from './activate/activate.component';
import { Activate } from './activate/activate.service';
import { HelpComponent } from './help/help.component';
import { LogoutComponent } from './logout/logout.component';
import { PasswordResetFinishComponent } from './password-reset/finish/password-reset-finish.component';
import { PasswordResetFinish } from './password-reset/finish/password-reset-finish.service';
import { PasswordResetInitComponent } from './password-reset/init/password-reset-init.component';
import { PasswordResetInit } from './password-reset/init/password-reset-init.service';
import { PasswordModule } from './password/password.module';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { IdpCallbackComponent } from './idp-callback/idp-callback.component';
import { LoginErrorComponent } from './login-error/login-error.component';
import { Password } from './password/password.service';
import { SettingsComponent } from './settings/settings.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { XmUserSettingsWidgetComponent } from '@xm-ngx/account/user-settings-widget';
import { XmUserSecuritySettingsComponent } from '@xm-ngx/account/user-security-settings';
import { XmUserLoginWidgetComponent } from '@xm-ngx/account/user-login-widget';
import { PasswordMatchDirective } from './password-reset/finish/password-match.directive';
import { NoSpacePatternDirective } from './password-reset/finish/password-pattern.directive';


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
        NoSpacePatternDirective,
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
        PasswordMatchDirective
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
