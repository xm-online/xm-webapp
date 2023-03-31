import { NgModule } from '@angular/core';
import { XmCodeContainerModule, XmCodeModule } from '@xm-ngx/components/code';
import { XmEnumControl, XmEnumComponent, XmEnumView } from '@xm-ngx/components/enum';
import { XmEnumExampleComponent } from './xm-enum-example.component';


@NgModule({
    imports: [
        XmEnumView,
        XmEnumComponent,
        XmEnumControl,
        XmCodeContainerModule,
        XmCodeModule,
    ],
    exports: [XmEnumExampleComponent],
    declarations: [XmEnumExampleComponent],
})
export class XmEnumExampleModule {
}
