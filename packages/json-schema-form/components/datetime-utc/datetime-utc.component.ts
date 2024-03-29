import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ajsf/core';
import { DatetimeUtcOptionsModel } from './datetime-utc-options.model';
import { dayjs } from '@xm-ngx/operators';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@Component({
    standalone: true,
    imports: [MatFormFieldModule,MatInputModule,CommonModule,FormsModule,XmTranslationModule],
    selector: 'xm-ext-datetime-utc-widget',
    templateUrl: 'datetime-utc.component.html',
})
export class DatetimeUtcComponent implements OnInit {

    @Input() public layoutNode: any;

    public controlName: string;
    public controlValue: any;
    public controlValueFormatted: any;
    public options: DatetimeUtcOptionsModel;

    constructor(private jsf: JsonSchemaFormService) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        if (this.controlValue) {
            this.controlValueFormatted = dayjs(this.controlValue).local().format('YYYY-MM-DD[T]HH:mm:ss');
        }
    }

    public changeText(event: any): void {
        this.jsf.updateValue(this, dayjs(event.target.value).utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]'));
    }
}
