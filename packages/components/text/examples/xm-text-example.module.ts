import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import { XmTextControlModule, XmTextRangeModule } from '@xm-ngx/components/text';
import { XmTextExampleComponent } from './xm-text-example.component';

@NgModule({
    declarations: [XmTextExampleComponent],
    exports: [XmTextExampleComponent],
    imports: [
        CommonModule,
        XmTextRangeModule,
        XmCodeModule,
        XmTextControlModule,
    ],
})
export class XmTextExampleModule {
}
