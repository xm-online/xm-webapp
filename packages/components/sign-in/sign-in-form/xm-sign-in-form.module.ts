import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { XmCheckboxControlModule } from '@xm-ngx/components/checkbox-control';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmEmailControlModule, XmPasswordControlModule } from '@xm-ngx/components/text';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmSignInFormComponent } from './xm-sign-in-form.component';


@NgModule({
    declarations: [XmSignInFormComponent],
    exports: [XmSignInFormComponent],
  imports: [
    CommonModule,
    XmEmailControlModule,
    XmPasswordControlModule,
    ReactiveFormsModule,
    XmTranslationModule,
    MatButtonModule,
    XmLoadingModule,
    MatFormFieldModule,
    XmCheckboxControlModule,
  ],
})
export class XmSignInFormModule {
}
