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
import { MatModule } from '../mat.module';
import {
    AuthServerProvider,
    AuthService,
    CSRFService,
    StateStorageService,
} from '@xm-ngx/core/auth';
import { AccountService } from '@xm-ngx/core/user';
import { LoginService } from '@xm-ngx/core/auth';
import { HasAnyAuthorityDirective, } from '@xm-ngx/core/permission';
import { ClientService } from '../../../packages/core/client/client.service';
import {
    PrivacyAndTermsDialogComponent,
} from './components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { XmConfirmDialogComponent } from './components/xm-confirmation-dialog/xm-confirm-dialog.component';
import { ContextService } from '../../../packages/core/context/context.service';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { FocusDirective } from './directives/focus.directive';
import { InputPreventPasteDirective } from './directives/input-prevent-paste.directive';
import { XmGMapApiInitDirective } from './g-map/xmGMapApiInit.directive';
import { SafeNamePipe } from './helpers/safe-name.pipe';
import { XmCondition } from './helpers/xm-condition';
import { XmDateTimePipe } from './helpers/xm-date-time.pipe';
import { XmEntityIconPipe } from './helpers/xm-entity-icon.pipe';
import { XmEntityStateSpecPipe } from './helpers/xm-entity-state-spec.pipe';
import { IdpComponent } from './idp/idp.component';
import { ContentTextareaComponent } from './jsf-extention/widgets/content-textarea/content-textarea.component';
import { CurrentLocationComponent } from './jsf-extention/widgets/current-location/current-location.component';
import { DatePickerComponent } from './jsf-extention/widgets/date-picker/date-picker.component';
import { DatetimePickerComponent } from './jsf-extention/widgets/datetime-picker/datetime-picker.component';
import { DatetimeUtcComponent } from './jsf-extention/widgets/datetime-utc/datetime-utc.component';
import { EmailMatcherComponent } from './jsf-extention/widgets/email-matcher/email-matcher.component';
import { ExtAutocompleteService } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from './jsf-extention/widgets/ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from './jsf-extention/widgets/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from './jsf-extention/widgets/ext-query-select/ext-query-select.component';
import { ExtSelectService } from './jsf-extention/widgets/ext-select/ext-select-service';
import { ExtSelectComponent } from './jsf-extention/widgets/ext-select/ext-select.component';
import { ExtTextareaComponent } from './jsf-extention/widgets/ext-textarea/ext-textarea.component';
import { FileUploadComponent } from './jsf-extention/widgets/file-upload/file-upload.component';
import { LinkFieldComponent } from './jsf-extention/widgets/link-field/link-field.component';
import { MultilingualInputComponent } from './jsf-extention/widgets/multilingual-input/multilingual-input.component';
import { TextSectionComponent } from './jsf-extention/widgets/text-section/text-section.component';
import { ValidationComponent } from './jsf-extention/widgets/validation-component/validation-component.component';
import { LoginComponent } from './login/login.component';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { PrivilegeService } from '@xm-ngx/core/permission';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register/register.service';
import { RoleService } from '../../../packages/core/role/role.service';
import { ParseByPathService } from './services/parse-by-path.service';
import { GateSharedLibsModule } from './shared-libs.module';
import { XmConfigService } from '@xm-ngx/core/config';
import { UserService } from '@xm-ngx/core/user';
import { TimeFromPipe } from './helpers/time-from.pipe';
import {
    MultilingualInputV2Component,
} from './jsf-extention/widgets/multilingual-input-v2/multilingual-input-v2.component';
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
