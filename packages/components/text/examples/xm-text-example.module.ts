import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import {
    XmEmailControlModule,
    XmPasswordControlModule,
    XmPhoneNumberControlModule,
    XmTextControlModule,
    XmTextDynamicViewModule,
    XmTextJoinModule,
    XmTextModule,
    XmTextRangeControlModule,
    XmTextViewModule,
} from '@xm-ngx/components/text';

import { XmTextExampleComponent } from './xm-text-example.component';

@NgModule({
    declarations: [XmTextExampleComponent],
    exports: [XmTextExampleComponent],
    imports: [
        CommonModule,
        XmTextRangeControlModule,
        XmCodeModule,
        XmTextControlModule,
        XmEmailControlModule,
        XmPasswordControlModule,
        XmPhoneNumberControlModule,
        XmTextModule,
        XmTextJoinModule,
        XmTextViewModule,
        XmTextDynamicViewModule,
    ],
})
export class XmTextExampleModule {
}
