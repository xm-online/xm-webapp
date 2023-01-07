import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { DateTimeAdapter, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';

import { ModulesLanguageHelper } from '@xm-ngx/translation';
import { DatePickerOptionsModel } from './date-picker-options.model';
import { DataPickerLayoutNode } from './data-picker.layoutNode';

import * as moment from 'moment';
const DEF_FORMAT = 'YYYY-MM-DD';

@Component({
    selector: 'xm-ajfs-datetime-picker',
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {

    @Input() public layoutNode: DataPickerLayoutNode;

    public controlValue: string;
    public controlValueDisplayed: string;
    public options: DatePickerOptionsModel;

    constructor(private jsf: JsonSchemaFormService,
                private translateService: TranslateService,
                private dateTimeAdapter: DateTimeAdapter<any>,
                private dateTimeAdapterLabels: OwlDateTimeIntl,
                private modulesLanguageHelper: ModulesLanguageHelper) {
        this.dateTimeAdapter.setLocale(this.modulesLanguageHelper.getLangKey());
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.setLocalizedButtons();
        this.updateViewValue();
    }

    public updateValue(event: any): void {
        const value = event.value || null;

        this.updateViewValue();
        this.updateModelValue(value);
    }

    private updateViewValue(): void {
        this.controlValueDisplayed = this.controlValue
            ? moment(this.controlValue).local().format(this.getFormat())
            : '';
    }

    private updateModelValue(value: string | null): void {
        const modelValue = value
            ? moment(value).format(DEF_FORMAT)
            : null;

        this.jsf.updateValue(this, modelValue);
    }

    private getFormat(): string {
        return this.options && this.options.formatString ? this.options.formatString : DEF_FORMAT;
    }

    private setLocalizedButtons(): void {
        this.dateTimeAdapterLabels.cancelBtnLabel = this.translateService.instant('global.common.cancel');
        this.dateTimeAdapterLabels.setBtnLabel = this.translateService.instant('global.common.set');
    }
}
