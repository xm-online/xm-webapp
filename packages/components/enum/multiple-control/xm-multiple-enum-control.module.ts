import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmEnumControlOptions } from '../control/xm-enum-control.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmEnumValue } from '../value/xm-enum.component';
import { XmMultipleEnumControlComponent } from './xm-multiple-enum-control.component';

@NgModule({
    imports: [
        XmTranslationModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        XmPermissionModule,
    ],
    exports: [XmMultipleEnumControlComponent],
    declarations: [XmMultipleEnumControlComponent],
})
export class XmMultipleEnumControlModule {
    public entry: XmDynamicControlConstructor<XmEnumValue[], XmEnumControlOptions> = XmMultipleEnumControlComponent;
}
