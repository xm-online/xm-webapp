import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { XmSharedModule } from '../shared/shared.module';
import {
    Activate,
    ActivateComponent,
    HelpComponent,
    Password,
    PasswordComponent,
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
import { MarkdownModule } from 'ngx-markdown';
import { JsonSchemaFormModule } from 'angular2-json-schema-form';

@NgModule({
  imports: [
    XmSharedModule,
    RouterModule.forChild(accountState),
    MarkdownModule,
    JsonSchemaFormModule,
  ],
    declarations: [
        SocialRegisterComponent,
        SocialAuthComponent,
        ActivateComponent,
        SignUpComponent,
        PasswordComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
        HelpComponent,
    ],
    providers: [
        Activate,
        Password,
        PasswordResetInit,
        PasswordResetFinish,
        NgbActiveModal,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateAccountModule {
}
