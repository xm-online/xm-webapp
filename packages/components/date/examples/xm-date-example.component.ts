import { Component } from '@angular/core';
import {
    XmDateControlOptions,
    XmDateOptions,
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
    public dateOptions: XmDateOptions = { format: 'dd.MM.yyyy HH:mm' };
    public dateRangeValue: XmDateRangeControlValue = { from: new Date(), to: new Date() };
    public dateViewOptions: XmDateViewOptions = { title: 'date-view', ...this.dateOptions };
    public dateControlOptions: XmDateControlOptions = { title: 'date-control-view', name: 'date-control-view' };
}
