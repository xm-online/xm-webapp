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
import { PrivilegeService } from '@xm-ngx/core/permission';
import { RegisterComponent, RegisterService } from '@xm-ngx/components/register';
import { RoleService } from '../../core/role/role.service';
import { ParseByPathService } from '@xm-ngx/core/permission';
import { GateSharedLibsModule } from './shared-libs.module';
import { XmConfigService } from '@xm-ngx/core/config';
import { UserService } from '@xm-ngx/core/user';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { XmGMapApiInitDirective } from '@xm-ngx/components/xmGMapApiInit.directive';
import { IdpComponent } from '@xm-ngx/components/login';
import { PasswordStrengthBarComponent } from '@xm-ngx/components/password-strength-bar';
import { XmJsonSchemaComponentsModule } from '@xm-ngx/json-schema-form/components/xm-json-schema-components.module';

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
    providers: [
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
        XmJsonSchemaComponentsModule,
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
