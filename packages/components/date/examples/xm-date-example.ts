import { Component, NgModule } from '@angular/core';
import {
    XmDateControlModule,
    XmDateControlOptions,
    XmDateModule,
    XmDateOptions,
    XmDateRangeControlModule,
    XmDateRangeControlValue,
    XmDateValue,
    XmDateViewModule,
    XmDateViewOptions,
} from '@xm-ngx/components/date';

@Component({
    selector: 'xm-date-example',
    template: `
        <xm-date [value]="dateValue" [options]="dateOptions"></xm-date>
        <xm-date-view [value]="dateValue" [options]="dateViewOptions"></xm-date-view>
        <xm-date-control [value]="dateValue" [options]="dateControlOptions"></xm-date-control>
        <xm-date-range-control [value]="dateRangeValue" [options]="dateViewOptions"></xm-date-range-control>
    `,
})
export class XmDateExample {
    public dateValue: XmDateValue = new Date();
    public dateOptions: XmDateOptions = { format: 'dd.MM.yyyy HH:mm' };
    public dateRangeValue: XmDateRangeControlValue = { from: new Date(), to: new Date() };
    public dateViewOptions: XmDateViewOptions = { title: 'date-view', ...this.dateOptions };
    public dateControlOptions: XmDateControlOptions = { title: 'date-control-view', name: 'date-control-view' };
}


@NgModule({
    imports: [
        XmDateModule,
        XmDateViewModule,
        XmDateControlModule,
        XmDateRangeControlModule,
    ],
    exports: [XmDateExample],
    declarations: [XmDateExample],
})
export class XmDateExampleModule {
}
