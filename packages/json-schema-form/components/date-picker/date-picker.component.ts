import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ModulesLanguageHelper, XmTranslationModule } from '@xm-ngx/translation';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JsonSchemaFormService } from '@ajsf/core';
import { DateTimeAdapter, OwlDateTimeIntl } from '@danielmoncada/angular-datetime-picker';
import { DatePickerOptionsModel } from './date-picker-options.model';
import { DataPickerLayoutNode } from './data-picker.layoutNode';

import moment from 'moment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const DEF_FORMAT = 'YYYY-MM-DD';

@Component({
    standalone: true,
    imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, OwlDateTimeModule, OwlNativeDateTimeModule, XmTranslationModule, FormsModule],
    selector: 'xm-ajfs-date-picker',
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
