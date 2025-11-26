import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { XmDynamicModule } from '@xm-ngx/dynamic';

import { XmSharedModule } from '@xm-ngx/shared';
import { IframeWidgetComponent } from '../iframe-widget/iframe-widget.component';
import { MdWidgetComponent } from '../md-widget/md-widget.component';
import { SignInUpWidgetComponent } from '../sign-in-up-widget/sign-in-up-widget.component';
import { WelcomeWidgetComponent } from '../welcome-widget/welcome-widget.component';
import { SignInUpV2WidgetComponent } from '../sign-in-up-v2-widget/sign-in-up-v2-widget.component';
import { LoginV2Component } from '../sign-in-up-v2-widget/login-v2/login-v2.component';
import { LoginTfaComponent } from '../sign-in-up-v2-widget/login-tfa/login-tfa.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        HttpClientJsonpModule,
        XmDynamicModule.forChild([
            { selector: 'xm-widget-iframe', loadChildren: () => IframeWidgetComponent },
            { selector: 'xm-widget-md', loadChildren: () => MdWidgetComponent },
            { selector: 'xm-widget-sign-in-up', loadChildren: () => SignInUpWidgetComponent },
            { selector: 'xm-widget-sign-in-up-v2', loadChildren: () => SignInUpV2WidgetComponent },
            { selector: 'xm-widget-welcome', loadChildren: () => WelcomeWidgetComponent },
            { selector: 'xm-login-v2', loadChildren: () => LoginV2Component },
            { selector: 'xm-login-tfa', loadChildren: () => LoginTfaComponent },
        ]),
        CovalentTextEditorModule,
    ],
    declarations: [
        IframeWidgetComponent,
        MdWidgetComponent,
        SignInUpWidgetComponent,
        WelcomeWidgetComponent,
    ],
    providers: [
    ],
})
export class ExtCommonModule {
}
