import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
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
    XmCodeModule,
  ],
    exports: [XmDateExampleComponent],
    declarations: [XmDateExampleComponent],
})
export class XmDateExampleModule {
}
