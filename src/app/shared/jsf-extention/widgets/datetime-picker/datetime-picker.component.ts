import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { DateTimeAdapter, OwlDateTimeIntl } from 'ng-pick-datetime';

import { Principal } from '../../../auth/principal.service';
import { ModulesLanguageHelper } from '../../../language/modules-language.helper';
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
    public controlValueModel: any;
    public controlValueDisplayed: any;
    public options: DatetimePickerOptionsModel;

    constructor(private jsf: JsonSchemaFormService,
                private translateService: TranslateService,
                private dateTimeAdapter: DateTimeAdapter<any>,
                private dateTimeAdapterLabels: OwlDateTimeIntl,
                private modulesLanguageHelper: ModulesLanguageHelper,
                public principal: Principal) {
        this.dateTimeAdapter.setLocale(this.modulesLanguageHelper.getLangKey());
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
        this.setLocalizedButtons();
        if (this.controlValue) {
            const formatString = this.getFormat();
            if (!this.controlValueModel) {
                this.controlValueModel = moment(this.controlValue).local().format();
            }
            this.controlValueDisplayed = moment(this.controlValue).local().format(formatString);
        }
    }

    public updateValue(event: any): void {
        const value = event.value || null;
        const formatString = this.getFormat();
        this.controlValueDisplayed = moment(this.controlValueModel).local().format(formatString);
        this.jsf.updateValue(this, this.getSendValue(value));
    }

    private getFormat(): string {
        return this.options && this.options.formatString ? this.options.formatString : DEF_FORMAT;
    }

    private getSendValue(value: string| unknown): string | null {
        let valueToSend;
        if (this.options && this.options.sendFormatString) {
            valueToSend = moment(value).format(this.options.sendFormatString)
        } else {
            valueToSend = moment(value).utc().format(DEF_FORMAT)
        }
        return valueToSend;
    }

    private setLocalizedButtons(): void {
        this.dateTimeAdapterLabels.cancelBtnLabel = this.translateService.instant('global.common.cancel');
        this.dateTimeAdapterLabels.setBtnLabel = this.translateService.instant('global.common.set');
    }
}
