import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MouseMoveParallaxModule } from '@xm-ngx/components/parallax';
import { XmSignInFormModule } from '@xm-ngx/components/sign-in/sign-in-form/xm-sign-in-form.module';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmSignInFullscreenComponent } from './xm-sign-in-fullscreen.component';


@NgModule({
    declarations: [XmSignInFullscreenComponent],
    exports: [XmSignInFullscreenComponent],
    imports: [
        CommonModule,
        XmSignInFormModule,
        MouseMoveParallaxModule,
        XmTranslationModule,
    ],
})
export class XmSignInFullscreenModule {
}
