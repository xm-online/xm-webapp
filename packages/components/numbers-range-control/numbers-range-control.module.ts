import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { ReactiveFormsModule } from '@angular/forms';
import { XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';
import {
    NumbersRangeControlComponent,
    XmNumbersRangeControlOptions,
} from './numbers-range-control.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        MatCardModule,
    ],
    exports: [NumbersRangeControlComponent],
    declarations: [NumbersRangeControlComponent],
})
export class NumbersRangeControlModule {
    public readonly entry: XmDynamicControlConstructor<Primitive, XmNumbersRangeControlOptions> = NumbersRangeControlComponent;
}
