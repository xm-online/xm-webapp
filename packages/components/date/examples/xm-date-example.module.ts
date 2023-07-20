import { NgModule } from '@angular/core';
import { XmCodeModule } from '@xm-ngx/components/code';
import {
    XmDateControl,
    XmDateComponent,
    XmDateRangeControl,
    XmDateView,
} from '@xm-ngx/components/date';
import { XmDateExampleComponent } from './xm-date-example.component';


@NgModule({
    imports: [
        XmDateComponent,
        XmDateView,
        XmDateControl,
        XmDateRangeControl,
        XmCodeModule,
    ],
    exports: [XmDateExampleComponent],
    declarations: [XmDateExampleComponent],
})
export class XmDateExampleModule {
}
