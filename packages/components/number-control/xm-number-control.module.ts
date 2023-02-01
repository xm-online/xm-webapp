import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { ReactiveFormsModule } from '@angular/forms';
import { HintModule } from '@xm-ngx/components/hint';
import { XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

import { XmNumberControl, XmNumberControlOptions } from './xm-number-control';
import { XmNumberDirective } from './xm-number.directive';

@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        HintModule,
    ],
    exports: [XmNumberControl],
    declarations: [XmNumberControl, XmNumberDirective],
})
export class XmNumberControlModule {
    public readonly entry: XmDynamicControlConstructor<Primitive, XmNumberControlOptions> = XmNumberControl;
}
