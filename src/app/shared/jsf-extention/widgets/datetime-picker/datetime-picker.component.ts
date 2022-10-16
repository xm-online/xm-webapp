import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JsonSchemaFormService } from '@xm-ngx/json-schema-form/core';
import { DateTimeAdapter, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';

import { ModulesLanguageHelper } from '@xm-ngx/components/language';
import { DatetimePickerOptionsModel } from './datetime-picker-options.model';

declare let moment;
const DEF_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

@Component({
    selector: 'xm-ajfs-datetime-picker',
    templateUrl: './datetime-picker.component.html',
    styleUrls: ['./datetime-picker.component.scss'],
})
export class DatetimePickerComponent implements OnInit {

    @Input() public layoutNode: any;

    public controlValue: any;
    public controlValueDisplayed: any;
    public options: DatetimePickerOptionsModel;

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
        if (this.controlValue) {
            const formatString = this.getFormat();
            this.controlValueDisplayed = moment(this.controlValue).local().format(formatString);
        }
    }

    public updateValue(event: any): void {
        const value = event.value || null;
        const formatString = this.getFormat();
        this.controlValueDisplayed = moment(this.controlValue).local().format(formatString);
        this.jsf.updateValue(this, this.getSendValue(value));
    }

    private getFormat(): string {
        return this.options && this.options.formatString ? this.options.formatString : DEF_FORMAT;
    }

    private setLocalizedButtons(): void {
        this.dateTimeAdapterLabels.cancelBtnLabel = this.translateService.instant('global.common.cancel');
        this.dateTimeAdapterLabels.setBtnLabel = this.translateService.instant('global.common.set');
    }

    private getSendValue(value: string | unknown): string {
        let valueToSend: string;

        if (this.options && this.options.sendFormatString) {
            valueToSend = moment(value).format(this.options.sendFormatString);
        } else {
            valueToSend = moment(value).utc().format(DEF_FORMAT);
        }

        return valueToSend;
    }
}
