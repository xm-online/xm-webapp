import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IControlFn } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmCheckboxControl, XmCheckboxControlOptions } from './xm-checkbox-control';

@NgModule({
    imports: [
        MatCheckboxModule,
        XmTranslationModule,
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [XmCheckboxControl],
    declarations: [XmCheckboxControl],
})
export class XmCheckboxControlModule {
    public readonly entry: IControlFn<Primitive, XmCheckboxControlOptions> = XmCheckboxControl;
}
