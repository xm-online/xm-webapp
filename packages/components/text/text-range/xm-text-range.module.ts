import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmTextRangeComponent } from './xm-text-range.component';

@NgModule({
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        MatFormFieldModule,
    ],
    exports: [XmTextRangeComponent],
    declarations: [XmTextRangeComponent],
})
export class XmTextRangeModule {
    public readonly entry: Type<XmTextRangeComponent> = XmTextRangeComponent;
}
