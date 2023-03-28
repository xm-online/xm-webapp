import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import {
    XmEmailControl,
    XmLabeledViewContainerComponent,
    XmPasswordControl,
    XmTextControl,
    XmTextDynamicView,
    XmTextJoinComponent,
    XmTextComponent,
    XmTextRangeControlComponent,
    XmTextTitleModule,
    XmTextTranslateModule,
    XmTextViewModule,
} from '@xm-ngx/components/text';

import { XmTextExampleComponent } from './xm-text-example.component';

@NgModule({
    declarations: [XmTextExampleComponent],
    exports: [XmTextExampleComponent],
    imports: [
        CommonModule,
        XmTextRangeControlComponent,
        XmCodeModule,
        XmTextControl,
        XmEmailControl,
        XmPasswordControl,
        XmTextComponent,
        XmTextJoinComponent,
        XmTextViewModule,
        XmTextDynamicView,
        XmLabeledViewContainerComponent,
        ReactiveFormsModule,
        XmCodeContainerModule,
        FormsModule,
        XmTextTranslateModule,
        XmTextTitleModule,
    ],
})
export class XmTextExampleModule {
}
