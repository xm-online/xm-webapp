import { Component, EventEmitter, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { DateTimeAdapter, OwlDateTimeIntl, OwlDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { XmDateComponent } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { TranslateService } from '@ngx-translate/core';
import { dayjs } from '@xm-ngx/operators';

const dateInitValues = {
    '7DaysAgo': 7,
    '14daysAgo': 14,
    monthAgo: 30,
    currentMonth: new Date().getDate() - 1,
};

type DateInitValues = keyof typeof dateInitValues;

export interface IDateOptions {
    hint?: HintText;
    title?: Translate | string;
    min?: DateValue;
    max?: DateValue;
    start?: DateValue;
    initValue?: DateInitValues;
    required?: boolean;
    firstDayOfWeek?: number;
}

type DateValue = string[] | Date[];

@Component({
    selector: 'xm-date-range-filter-control',
    template: `
        <mat-form-field class="xm-custom-input-icon">
            <mat-label *ngIf="config?.title">{{ config?.title | translate }}</mat-label>

            <div class="to-display" *ngIf="value && value.length > 0">
                <xm-date [value]="value[0]" [config]="config"></xm-date>
                ~
                <xm-date [value]="value[1]" [config]="config"></xm-date>
            </div>

            <input #dateControl='ngModel'
                   [(ngModel)]="value"
                   [min]="config?.min"
                   [max]="config?.max"
                   [selectMode]="'range'"
                   (ngModelChange)="change($event)"
                   [owlDateTimeTrigger]="dt1"
                   [owlDateTime]="dt1"
                   [disabled]="disabled"
                   [required]="config?.required"
                   class="abs"
                   matInput>
            <mat-error *ngIf="dateControl.invalid">{{'common-webapp-ext.validation.required' | translate}}</mat-error>
            <button *ngIf="value && !disabled" matSuffix mat-icon-button (click)="change(null)">
                <mat-icon>close</mat-icon>
            </button>

            <mat-icon [owlDateTimeTrigger]="dt1" class="icon">date_range</mat-icon>

            <owl-date-time #dt1 [startAt]="config?.start" [firstDayOfWeek]="config?.firstDayOfWeek"
                           [pickerType]="'calendar'"></owl-date-time>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslationModule,
        ControlErrorModule,
        FormsModule,
        OwlDateTimeModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        XmDateComponent,
        HintModule,
    ],
    standalone: true,
    styleUrls: ['./date.control.scss'],
})
export class DateRangeFilterControl extends NgControlAccessor<DateValue>
    implements XmDynamicControl<DateValue, IDateOptions>, OnInit {

    @Output() public valueChange: EventEmitter<DateValue> = new EventEmitter<DateValue>();
    @Input() public config: IDateOptions;

    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private translateService: TranslateService,
        private dateTimeAdapter: DateTimeAdapter<any>,
        private dateTimeIntl: OwlDateTimeIntl,
    ) {
        super(ngControl);
    }

    public ngOnInit(): void {
        this.setDateRange();
        this.localizedDateRangeLabels();
        this.dateTimeAdapter.setLocale(this.translateService.currentLang);
    }

    private formatDate([start, end]: DateValue): DateValue {
        return [
            dayjs(start).startOf('day').toDate(),
            dayjs(end).endOf('day').toDate(),
        ];
    }

    public change(v: DateValue): void {
        v = this.formatDate(v);
        this.value = v;
        this._onChange(v);
        this.valueChange.emit(v);
    }

    private localizedDateRangeLabels(): void {
        this.dateTimeIntl.rangeFromLabel = this.translateService.instant('date-time-picker.labels.from');
        this.dateTimeIntl.rangeToLabel = this.translateService.instant('date-time-picker.labels.to');
    }

    private setDateRange(): void {
        const { initValue } = this.config;

        if (!initValue) {
            return;
        }

        if (!(initValue in dateInitValues)) {
            console.warn(`Wrong 'initValue', it can be only one of ${Object.keys(dateInitValues)}`);
            return;
        }

        const now = new Date();
        const pastDate = now.getDate() - dateInitValues[initValue];
        this.value = [new Date(now.setDate(pastDate)), new Date()];
        this.change(this.value);
    }
}
