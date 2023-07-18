import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmBoolComponent, XmBoolControl, XmCheckboxControl } from '@xm-ngx/components/bool';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmBoolExampleComponent } from './xm-bool-example/xm-bool-example.component';


@NgModule({
    declarations: [XmBoolExampleComponent],
    exports: [XmBoolExampleComponent],
    imports: [
        CommonModule,
        XmBoolControl,
        XmBoolComponent,
        XmCodeContainerModule,
        XmCodeModule,
        XmCheckboxControl,
    ],
})
export class XmBoolExampleModule {
}
