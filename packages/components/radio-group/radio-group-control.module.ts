import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { HintModule } from '@xm-ngx/components/hint';
import { MatRadioModule } from '@angular/material/radio';
import { XmRadioGroupControlComponent, XmRadioControlOptions, XmRadioValue } from './radio-group-control.component';

@NgModule({
    imports: [
        XmTranslationModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        MatRadioModule,
        ControlErrorModule,
        ReactiveFormsModule,
        XmPermissionModule,
        HintModule,
    ],
    exports: [XmRadioGroupControlComponent],
    declarations: [XmRadioGroupControlComponent],
})
export class XmRadioGroupControlModule {
    public entry: XmDynamicControlConstructor<XmRadioValue, XmRadioControlOptions> = XmRadioGroupControlComponent;
}
