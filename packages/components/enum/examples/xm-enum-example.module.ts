import { NgModule } from '@angular/core';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmEnumControlModule, XmEnumModule, XmEnumViewModule } from '@xm-ngx/components/enum';
import { XmEnumExampleComponent } from './xm-Enum-example.component';


@NgModule({
    imports: [
        XmEnumViewModule,
        XmEnumModule,
        XmEnumControlModule,
        XmCodeContainerModule,
        XmCodeModule,
    ],
    exports: [XmEnumExampleComponent],
    declarations: [XmEnumExampleComponent],
})
export class XmEnumExampleModule {
}
