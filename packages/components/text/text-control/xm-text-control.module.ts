import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmTextControl, XmTextControlOptions } from './xm-text-control';

@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
    ],
    exports: [XmTextControl],
    declarations: [XmTextControl],
})
export class XmTextControlModule {
    public readonly entry: IControlFn<Primitive, XmTextControlOptions> = XmTextControl;
}
