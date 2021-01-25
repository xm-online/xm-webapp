import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BoolValueModule, XmBoolControlModule } from '@xm-ngx/components/bool';
import { XmBoolExampleComponent } from './xm-bool-example/xm-bool-example.component';


@NgModule({
    declarations: [XmBoolExampleComponent],
    exports: [XmBoolExampleComponent],
    imports: [
        CommonModule,
        XmBoolControlModule,
        BoolValueModule,
    ],
})
export class XmBoolExampleModule {
}
