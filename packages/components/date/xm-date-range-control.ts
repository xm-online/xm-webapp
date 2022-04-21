import {
    AfterViewInit,
    Component,
    Inject,
    Input,
    LOCALE_ID,
    NgModule,
    OnDestroy, Optional, Self,
} from '@angular/core';
import { FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { filter, withLatestFrom } from 'rxjs/operators';
import { template } from 'lodash/fp';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import * as _ from 'lodash';

export interface XmDateRangeControlOptions {
    hint?: HintText;
    title: Translate;
    fromName?: string;
    toName?: string;
    format?: string;
    transform?: {
        quotes: string[];
        separator: string;
    }
}

export type XmDateRangeControlValue = {
    from: XmDateValue;
    to: XmDateValue;
};

export type XmDateRangeValueOrString = XmDateRangeControlValue | string;

export const XM_DATE_RANGE_CONTROL_OPTIONS: XmDateRangeControlOptions = {
    hint: null,
    title: '',
    format: 'y-MM-dThh:mm:ss',
};

@Component({
    selector: 'xm-date-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{options?.title | translate}}</mat-label>
            <mat-date-range-input [formGroup]="group"
                                  [rangePicker]="picker">
                <input matStartDate
                       (dateChange)="startDateChange($event)"
                       (focus)="picker.open()"
                       [name]="options?.fromName"
                       formControlName="from">
                <input matEndDate
                       (dateChange)="endDateChange($event)"
                       (focus)="picker.open()"
                       formControlName="to"
                       [name]="options?.toName">
            </mat-date-range-input>

            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>

            <button mat-button mat-icon-button matSuffix *ngIf="value !== null" (click)="change(null)">
                <mat-icon>close</mat-icon>
            </button>

            <mat-date-range-picker #picker></mat-date-range-picker>

            <mat-error *xmControlErrors="group?.errors || group?.controls.from?.errors || group?.controls.to?.errors; message as message">{{message}}</mat-error>
            <mat-hint [hint]="options?.hint"></mat-hint>
        </mat-form-field>
    `,
})
export class XmDateRangeControl extends NgControlAccessor<XmDateRangeValueOrString> implements AfterViewInit, OnDestroy {
    private startDate = new Subject<XmDateValue>();
    private endDate = new Subject<XmDateValue>();

    private _options: XmDateRangeControlOptions;

    @Input() public set options(options: XmDateRangeControlOptions) {
        this._options = _.defaultsDeep(options, XM_DATE_RANGE_CONTROL_OPTIONS);
        this.update();
    }
    public get options(): XmDateRangeControlOptions {
        return this._options;
    }

    @Input()
    public set value(value: XmDateRangeValueOrString) {
        this._value = value;
        this.update();
    }
    public get value(): XmDateRangeValueOrString {
        return this._value;
    }

    @Input() public group: FormGroup = new FormGroup({
        from: new FormControl(),
        to: new FormControl(),
    });

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        super(ngControl);
    }

    private update(): void {
        if (this.value && this.options) {
            this._value = this.toModel(this.value);
        }

        if (this.value == null) {
            this.group.reset();
        } else if (typeof this.value !== 'string') {
            this.group.patchValue(this.value, { emitEvent: false });
        }
    }

    public ngAfterViewInit(): void {
        this.endDate.pipe(
            filter(value => !!value),
            withLatestFrom(
                this.startDate,
                this.endDate,
                (_, from, to) => ({ from, to }),
            ),
            takeUntilOnDestroy(this),
        ).subscribe((dates) => {
            const value = this.fromModel(dates);

            this.change(value);
        });
    }

    private toModel(value: XmDateRangeValueOrString): XmDateRangeControlValue {
        if (typeof value === 'string') {
            if (this.options?.transform == null) {
                return {
                    from: null,
                    to: null,
                };
            }

            const [from, to] = value
                ?.split(` ${this.getSeparator()} `)
                ?.map(x => _.trim(x, this.buildQuotedString(' ')));

            if (from == null && to == null) {
                return {
                    from: null,
                    to: null,
                };
            }

            return this.normalizeDates({ from, to });
        }

        return value;
    }

    private fromModel(dates: XmDateRangeControlValue): string {
        if (this.options?.transform == null) {
            return '';
        }

        const templateFn = template(this.buildQuotedString(' ${from} ' + this.getSeparator() + ' ${to} '));

        if (templateFn) {
            return templateFn(this.normalizeDates(dates));
        }

        return '';
    }

    private normalizeDates({from, to}: XmDateRangeControlValue): XmDateRangeControlValue {
        return {
            from: formatDate(from, this.options.format, this.locale),
            to: formatDate(to, this.options.format, this.locale),
        };
    }

    private buildQuotedString(str: string): string {
        const { quotes: [prepend, append] } = this.options.transform;

        return `${prepend}${str}${append}`;
    }

    private getSeparator(): string {
        const { separator } = this.options.transform;
        return separator;
    }

    public startDateChange(date: MatDatepickerInputEvent<XmDateValue>): void {
        this.startDate.next(date.value);
    }

    public endDateChange(date: MatDatepickerInputEvent<XmDateValue>): void {
        this.endDate.next(date.value);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}

@NgModule({
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslationModule,
        ControlErrorModule,
        HintModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [XmDateRangeControl],
    declarations: [XmDateRangeControl],
})
export class XmDateRangeControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateRangeValueOrString, XmDateRangeControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateRangeValueOrString, XmDateRangeControlOptions> = XmDateRangeControl;
}
