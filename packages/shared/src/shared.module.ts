import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmJsonSchemaFormModule } from '@xm-ngx/json-schema-form/core';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MarkdownModule } from 'ngx-markdown';

import { UserLoginService } from '@xm-ngx/account/user-login-widget/login/user-login.service';
import { UserLoginFormComponent, XmUserLoginWidgetComponent } from '@xm-ngx/account/user-login-widget';
import { MatModule } from '../../../src/app/mat.module';
import {
    CSRFService,
    StateStorageService,
} from '@xm-ngx/core/auth';

import {
    AccountService,
    AuthServerProvider,
    AuthService,
} from '@xm-ngx/core/user';
import { LoginComponent, LoginService } from '@xm-ngx/components/login';
import { HasAnyAuthorityDirective, } from '@xm-ngx/core/permission';
import { ClientService } from '../../core/client/client.service';
import { ContextService } from '../../core/context/context.service';
import { DigitOnlyDirective, FocusDirective, InputPreventPasteDirective } from '@xm-ngx/components/text';
import { SafeNamePipe } from '@xm-ngx/pipes';
import { XmCondition } from '@xm-ngx/pipes';
import { XmDateTimePipe } from '@xm-ngx/translation/pipes';
import { XmEntityIconPipe } from '@xm-ngx/entity/pipes';
import { XmEntityStateSpecPipe } from '@xm-ngx/entity/pipes';
import { TimeFromPipe } from '@xm-ngx/translation/pipes';
import { ContentTextareaComponent } from '../../../packages/json-schema-form/components/content-textarea/content-textarea.component';
import { CurrentLocationComponent } from '../../../packages/json-schema-form/components/current-location/current-location.component';
import { DatePickerComponent } from '../../../packages/json-schema-form/components/date-picker/date-picker.component';
import { DatetimePickerComponent } from '../../../packages/json-schema-form/components/datetime-picker/datetime-picker.component';
import { DatetimeUtcComponent } from '../../../packages/json-schema-form/components/datetime-utc/datetime-utc.component';
import { EmailMatcherComponent } from '../../../packages/json-schema-form/components/email-matcher/email-matcher.component';
import { ExtAutocompleteService } from '../../../packages/json-schema-form/components/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from '../../../packages/json-schema-form/components/ext-autocomplete/ext-autocomplete.component';
import { ExtMdEditorComponent } from '../../../packages/json-schema-form/components/ext-md-editor/ext-md-editor.component';
import { ExtMultiSelectComponent } from '../../../packages/json-schema-form/components/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from '../../../packages/json-schema-form/components/ext-query-select/ext-query-select.component';
import { ExtSelectService } from '../../../packages/json-schema-form/components/ext-select/ext-select-service';
import { ExtSelectComponent } from '../../../packages/json-schema-form/components/ext-select/ext-select.component';
import { ExtTextareaComponent } from '../../../packages/json-schema-form/components/ext-textarea/ext-textarea.component';
import { GeoInputComponent } from '../../../packages/json-schema-form/components/geo-input/geo-input.component';
import { FileUploadComponent } from '../../../packages/json-schema-form/components/file-upload/file-upload.component';
import { LinkFieldComponent } from '../../../packages/json-schema-form/components/link-field/link-field.component';
import { MultilingualInputComponent } from '../../../packages/json-schema-form/components/multilingual-input/multilingual-input.component';
import { TextSectionComponent } from '../../../packages/json-schema-form/components/text-section/text-section.component';
import { ValidationComponent } from '../../../packages/json-schema-form/components/validation-component/validation-component.component';
import { PrivilegeService } from '@xm-ngx/core/permission';
import { RegisterComponent, RegisterService } from '@xm-ngx/components/register';
import { RoleService } from '../../core/role/role.service';
import { ParseByPathService } from '@xm-ngx/core/permission';
import { GateSharedLibsModule } from './shared-libs.module';
import { XmConfigService } from '@xm-ngx/core/config';
import { UserService } from '@xm-ngx/core/user';
import {
    MultilingualInputV2Component,
} from '../../../packages/json-schema-form/components/multilingual-input-v2/multilingual-input-v2.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { XmGMapApiInitDirective } from '@xm-ngx/components/xmGMapApiInit.directive';
import { IdpComponent } from '@xm-ngx/components/idp';
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar';

const PIPES = [
    XmDateTimePipe,
    XmEntityStateSpecPipe,
    SafeNamePipe,
    XmEntityIconPipe,
    TimeFromPipe,
];

const DIRECTIVES = [
    HasAnyAuthorityDirective,
    XmCondition,
    FocusDirective,
    InputPreventPasteDirective,
    DigitOnlyDirective,
    XmGMapApiInitDirective,
];

const COMPONENTS = [
    LoginComponent,
    RegisterComponent,
    PasswordStrengthBarComponent,
    IdpComponent,
];

@NgModule({
    imports: [
        XmJsonSchemaFormModule,
        XmUserLoginWidgetComponent,
        UserLoginFormComponent,
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
        CommonModule,
        COMPONENTS,
        DIRECTIVES,
        PIPES,
    ],
    declarations: [
        // Components
        CurrentLocationComponent,
        ExtSelectComponent,
        ValidationComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ExtTextareaComponent,
        GeoInputComponent,
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
    ],
    providers: [
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
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        GeoInputComponent,
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
        COMPONENTS,
        DIRECTIVES,
        PIPES,
        // Modules
        GateSharedLibsModule,
        MatModule,
        GooglePlaceModule,
        XmUserLoginWidgetComponent,
        UserLoginFormComponent,
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
