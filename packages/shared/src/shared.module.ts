import { DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form/core';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MarkdownModule } from 'ngx-markdown';

import { UserLoginService } from '@xm-ngx/account/user-login-widget/login/user-login.service';
import { XmUserLoginWidgetModule } from '@xm-ngx/account/user-login-widget';
import { MatModule } from '../../../src/app/mat.module';
import {
    AccountService,
    AuthServerProvider,
    AuthService,
    CSRFService,
    HasAnyAuthorityDirective,
    LoginService,
    StateStorageService,
} from '@xm-ngx/core/auth';
import { ClientService } from '@xm-ngx/core/client';
import {
    PrivacyAndTermsDialogComponent,
} from '../../components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfirmDialogComponent } from '../../components/xm-confirmation-dialog/xm-confirm-dialog.component';
import { ContextService } from '@xm-ngx/core';
import { DigitOnlyDirective } from '@xm-ngx/components/text/input/digit-only.directive';
import { FocusDirective } from '@xm-ngx/components/text/input/focus.directive';
import { InputPreventPasteDirective } from '@xm-ngx/components/text/input/input-prevent-paste.directive';
import { XmGMapApiInitDirective } from '@xm-ngx/components/google-map/xmGMapApiInit.directive';
import { SafeNamePipe } from '../pipes/safe-name.pipe';
import { XmCondition } from '../pipes/xm-condition';
import { XmDateTimePipe } from '../pipes/xm-date-time.pipe';
import { XmEntityIconPipe } from '../pipes/xm-entity-icon.pipe';
import { XmEntityStateSpecPipe } from '../pipes/xm-entity-state-spec.pipe';
import { IdpComponent } from '../../components/idp/idp.component';
import { ContentTextareaComponent } from '@xm-ngx/json-schema-form/widgets/content-textarea/content-textarea.component';
import { CurrentLocationComponent } from '@xm-ngx/json-schema-form/widgets/current-location/current-location.component';
import { DatePickerComponent } from '@xm-ngx/json-schema-form/widgets/date-picker/date-picker.component';
import { DatetimePickerComponent } from '@xm-ngx/json-schema-form/widgets/datetime-picker/datetime-picker.component';
import { DatetimeUtcComponent } from '@xm-ngx/json-schema-form/widgets/datetime-utc/datetime-utc.component';
import { EmailMatcherComponent } from '@xm-ngx/json-schema-form/widgets/email-matcher/email-matcher.component';
import { ExtAutocompleteService } from '@xm-ngx/json-schema-form/widgets/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from '@xm-ngx/json-schema-form/widgets/ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from '@xm-ngx/json-schema-form/widgets/ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from '@xm-ngx/json-schema-form/widgets/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from '@xm-ngx/json-schema-form/widgets/ext-query-select/ext-query-select.component';
import { ExtSelectService } from '@xm-ngx/json-schema-form/widgets/ext-select/ext-select-service';
import { ExtSelectComponent } from '@xm-ngx/json-schema-form/widgets/ext-select/ext-select.component';
import { ExtTextareaComponent } from '@xm-ngx/json-schema-form/widgets/ext-textarea/ext-textarea.component';
import { FileUploadComponent } from '@xm-ngx/json-schema-form/widgets/file-upload/file-upload.component';
import { LinkFieldComponent } from '@xm-ngx/json-schema-form/widgets/link-field/link-field.component';
import { MultilingualInputComponent } from '@xm-ngx/json-schema-form/widgets/multilingual-input/multilingual-input.component';
import { TextSectionComponent } from '@xm-ngx/json-schema-form/widgets/text-section/text-section.component';
import { ValidationComponent } from '@xm-ngx/json-schema-form/widgets/validation-component/validation-component.component';
import { LoginComponent } from '@xm-ngx/components/login/login.component';
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar/password-strength-bar.component';
import { PrivilegeService } from '@xm-ngx/core/permission';
import { RegisterComponent } from '../../components/register/register.component';
import { RegisterService } from '../../components/register/register.service';
import { RoleService } from '@xm-ngx/core/permission';
import { ParseByPathService } from '../operators/parse-by-path.service';
import { GateSharedLibsModule } from './shared-libs.module';
import { XmConfigService } from '@xm-ngx/core/config';
import { UserService } from '@xm-ngx/core/user';
import { TimeFromPipe } from '../pipes/time-from.pipe';
import {
    MultilingualInputV2Component,
} from '@xm-ngx/json-schema-form/widgets/multilingual-input-v2/multilingual-input-v2.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    imports: [
        XmJsonSchemaFormModule,
        XmUserLoginWidgetModule,
        GateSharedLibsModule,
        ReCaptchaModule,
        MarkdownModule.forChild(),
        MatModule,
        CovalentTextEditorModule,
        OwlDateTimeModule,
        GooglePlaceModule,
        OwlNativeDateTimeModule,
        ModalCloseModule,
        AngularEditorModule,
    ],
    declarations: [
        // Components
        LoginComponent,
        RegisterComponent,
        PasswordStrengthBarComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ValidationComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ExtTextareaComponent,
        ContentTextareaComponent,
        LinkFieldComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        MultilingualInputV2Component,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        PrivacyAndTermsDialogComponent,
        IdpComponent,
        // Directives
        HasAnyAuthorityDirective,
        XmCondition,
        FocusDirective,
        InputPreventPasteDirective,
        DigitOnlyDirective,
        XmGMapApiInitDirective,
        // Pipes
        XmDateTimePipe,
        XmEntityStateSpecPipe,
        SafeNamePipe,
        XmEntityIconPipe,
        TimeFromPipe,
    ],
    providers: [
        // Components
        PasswordStrengthBarComponent,
        // Services
        ExtSelectService,
        ExtAutocompleteService,
        // Directives
        XmCondition,
        // Pipes
        SafeNamePipe,
        XmDateTimePipe,
        DatePipe,
        XmEntityIconPipe,
        TimeFromPipe,
    ],
    exports: [
        // Components
        LoginComponent,
        RegisterComponent,
        PasswordStrengthBarComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        ContentTextareaComponent,
        LinkFieldComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        DatePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        IdpComponent,
        // Directives
        HasAnyAuthorityDirective,
        XmCondition,
        FocusDirective,
        InputPreventPasteDirective,
        DigitOnlyDirective,
        XmGMapApiInitDirective,
        // Pipes
        SafeNamePipe,
        XmEntityStateSpecPipe,
        XmDateTimePipe,
        DatePipe,
        XmEntityIconPipe,
        TimeFromPipe,
        // Modules
        GateSharedLibsModule,
        MatModule,
        GooglePlaceModule,
        XmUserLoginWidgetModule,
        XmJsonSchemaFormModule,
    ],
})
export class XmSharedModule {
    public static forRoot(): ModuleWithProviders<XmSharedModule> {
        return {
            ngModule: XmSharedModule,
            providers: [
                ContextService,
                LoginService,
                RegisterService,
                AccountService,
                StateStorageService,
                CSRFService,
                AuthServerProvider,
                AuthService,
                UserService,
                ClientService,
                UserLoginService,
                PrivilegeService,
                ParseByPathService,
                RoleService,
                XmConfigService,
            ],
        };
    }
}
