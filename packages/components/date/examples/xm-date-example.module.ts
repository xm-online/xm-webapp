import { NgModule } from '@angular/core';
import {
    XmDateControlModule,
    XmDateModule,
    XmDateRangeControlModule,
    XmDateViewModule,
} from '@xm-ngx/components/date';
import { XmDateExampleComponent } from '@xm-ngx/components/date/examples/xm-date-example.component';


@NgModule({
    imports: [
        XmDateModule,
        XmDateViewModule,
        XmDateControlModule,
        XmDateRangeControlModule,
    ],
    exports: [XmDateExampleComponent],
    declarations: [XmDateExampleComponent],
})
export class XmDateExampleModule {
}
