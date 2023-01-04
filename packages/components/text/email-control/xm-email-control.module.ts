import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { XmDynamicControlConstructor } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmEmailControl } from './xm-email-control';
import { XmEmailControlOptions } from './xm-email-control-options';
import { HintModule } from '@xm-ngx/components/hint';

@NgModule({
    imports: [
        MatFormFieldModule,
        ControlErrorModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
        HintModule,
    ],
    exports: [XmEmailControl],
    declarations: [XmEmailControl],
})
export class XmEmailControlModule {
    public entry: XmDynamicControlConstructor<string, XmEmailControlOptions> = XmEmailControl;
}
