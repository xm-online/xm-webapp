import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmDynamicControlConstructor, XmDynamicControlEntryModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmTextControl } from './xm-text-control';

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
export class XmTextControlModule implements XmDynamicControlEntryModule {
    public entry: XmDynamicControlConstructor = XmTextControl;
}
