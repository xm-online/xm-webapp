import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { IControlFn } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmPhoneNumberControl } from './xm-phone-number-control';
import { XmPhoneNumberControlOptions } from './xm-phone-number-control-options';

@NgModule({
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
    ],
    exports: [XmPhoneNumberControl],
    declarations: [XmPhoneNumberControl],
})
export class XmPhoneNumberControlModule {
    public entry: IControlFn<string, XmPhoneNumberControlOptions> = XmPhoneNumberControl;
}
