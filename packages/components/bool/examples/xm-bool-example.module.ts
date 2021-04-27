import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmBoolModule, XmBoolControlModule, XmCheckboxControlModule } from '@xm-ngx/components/bool';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmBoolExampleComponent } from './xm-bool-example/xm-bool-example.component';


@NgModule({
    declarations: [XmBoolExampleComponent],
    exports: [XmBoolExampleComponent],
    imports: [
        CommonModule,
        XmBoolControlModule,
        XmBoolModule,
        XmCodeContainerModule,
        XmCodeModule,
        XmCheckboxControlModule,
    ],
})
export class XmBoolExampleModule {
}
