import { NgModule } from '@angular/core';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmEnumControlComponent, XmEnumComponent, XmEnumView } from '@xm-ngx/components/enum';
import { XmEnumExampleComponent } from './xm-enum-example.component';


@NgModule({
    imports: [
        XmEnumView,
        XmEnumComponent,
        XmEnumControlComponent,
        XmCodeContainerModule,
        XmCodeModule,
    ],
    exports: [XmEnumExampleComponent],
    declarations: [XmEnumExampleComponent],
})
export class XmEnumExampleModule {
}
