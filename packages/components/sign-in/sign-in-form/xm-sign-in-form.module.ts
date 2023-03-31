import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { XmCheckboxControl } from '@xm-ngx/components/bool';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmEmailControl, XmPasswordControl } from '@xm-ngx/components/text';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmSignInFormComponent } from './xm-sign-in-form.component';


@NgModule({
    declarations: [XmSignInFormComponent],
    exports: [XmSignInFormComponent],
    imports: [
        CommonModule,
        XmEmailControl,
        XmPasswordControl,
        ReactiveFormsModule,
        XmTranslationModule,
        MatButtonModule,
        XmLoadingModule,
        MatFormFieldModule,
        XmCheckboxControl,
    ],
})
export class XmSignInFormModule {
}
