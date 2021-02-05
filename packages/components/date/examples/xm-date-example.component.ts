import { Component } from '@angular/core';
import {
    XmDateControlOptions,
    XmDateOptions,
    XmDateRangeControlOptions,
    XmDateRangeControlValue,
    XmDateValue,
    XmDateViewOptions,
} from '@xm-ngx/components/date';

@Component({
    selector: 'xm-date-example',
    templateUrl: './xm-date-example.component.html',
})
export class XmDateExampleComponent {
    public dateValue: XmDateValue = new Date();
    public dateOptions: XmDateOptions = { format: 'dd.MM.yyyy HH:mm, MMMM', timezone: '+3', locale: 'uk' };

    public dateViewOptions: XmDateViewOptions = { title: 'date-view', ...this.dateOptions, textStyle: null };
    public dateViewInlineOptions: XmDateViewOptions = { title: 'date-view', ...this.dateOptions, textStyle: 'inline' };

    public dateControlOptions: XmDateControlOptions = { title: 'date-control-view', name: 'date-control-view' };

    public dateRangeValue: XmDateRangeControlValue = { from: new Date(), to: new Date() };
    public dateRangeOptions: XmDateRangeControlOptions = { title: 'date-range-control', ...this.dateOptions };
}
