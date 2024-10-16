import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnDestroy, Optional, Self } from '@angular/core';
import { FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate, XmTranslatePipe } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { filter, map, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TransformDateStringCodec } from './transform-date-string-codec.service';
import { cloneDeep, defaultsDeep } from 'lodash';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/custom-date-adapter';

export interface XmDateRangeControlConfig {
    hint?: HintText;
    title: Translate;
    fromName?: string;
    valueType: 'object' | 'string';
    toName?: string;
    format?: string;
    transform?: {
        quotes: string[];
        separator: string;
    }
    intervalFromMinDateInDays?: number;
    hideClear?: boolean;
}

export type XmDateRangeValue = XmDateValue | string | number;

export type XmDateRangeControlValue = {
    from: XmDateRangeValue,
    to: XmDateRangeValue,
}

export type XmDateRangeValueOrString = XmDateRangeControlValue | string;

export const XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT: XmDateRangeControlConfig = {
    hint: null,
    title: '',
    format: 'y-MM-dThh:mm:ss',
    valueType: 'string',
    transform: {
        quotes: [
            '[',
            ']',
        ],
        separator: 'TO',
    },
};

@Component({
    selector: 'xm-date-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{config.title | xmTranslate}}</mat-label>
            <mat-date-range-input [formGroup]="group"
                                  [min]="minDate"
                                  [rangePicker]="picker">
                <input matStartDate
                       (dateChange)="dateChanged()"
                       (focus)="picker.open()"
                       [name]="config.fromName ?? 'from'"
                       formControlName="from">
                <input matEndDate
                       (dateChange)="dateChanged()"
                       (focus)="picker.open()"
                       formControlName="to"
                       [name]="config.toName ?? 'to'">
            </mat-date-range-input>

            <span matSuffix class="d-flex">
                <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
                <button mat-icon-button *ngIf="(value !== null) && !config?.hideClear" [disabled]="group.disabled" (click)="clear()">
                    <mat-icon>close</mat-icon>
                </button>
            </span>

            <mat-date-range-picker #picker></mat-date-range-picker>

            <mat-error
                *xmControlErrors="group?.errors || group?.controls.from?.errors || group?.controls.to?.errors; message as message">{{message}}</mat-error>
            <mat-hint [hint]="config?.hint"></mat-hint>
        </mat-form-field>
    `,
    providers: [
        TransformDateStringCodec,
        { provide: DateAdapter, useClass: CustomDateAdapter },
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslatePipe,
        ControlErrorModule,
        HintModule,
        MatButtonModule,
        MatIconModule,
    ],
    standalone: true,
})
export class XmDateRangeControl extends NgControlAccessor<XmDateRangeValueOrString> implements AfterViewInit, OnDestroy {
    @Input() public group = new FormGroup({
        from: new FormControl<XmDateRangeValue>(''),
        to: new FormControl<XmDateRangeValue>(''),
    });
    private refreshDate = new Subject<void>();
    public minDate: Date | null;

    constructor(
        private transformDateStringCodec: TransformDateStringCodec,
        @Inject(LOCALE_ID) public locale: string,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        super(ngControl);
    }

    private _config: XmDateRangeControlConfig = cloneDeep(XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT);

    public get config(): XmDateRangeControlConfig {
        return this._config;
    }

    @Input()
    public set config(value: XmDateRangeControlConfig) {
        this._config = defaultsDeep(cloneDeep(value), cloneDeep(XM_DATE_RANGE_CONTROL_CONFIG_DEFAULT));
        this.transformDateStringCodec.config = this._config;
        this.minDate = this.defineStartDate();
    }

    @Input()
    public set value(value: XmDateRangeValueOrString) {
        this._value = defaultsDeep(cloneDeep(value), { from: '', to: '' });
        this.syncValue(value);
    }

    public ngAfterViewInit(): void {
        this.refreshDate.pipe(
            map(() => this.group.value),
            filter(({ to }) => !!to),
            takeUntilOnDestroy(this),
        ).subscribe((dates) => {
            let value: XmDateRangeValueOrString;

            if (this._config.valueType === 'string') {
                value = this.transformDateStringCodec.fromModel(dates as XmDateRangeControlValue);
            } else {
                value = { from: dates.from, to: dates.to };
            }

            this.change(value);
        });
    }

    public setDisabledState(isDisabled: boolean): void {
        isDisabled
            ? this.group.disable({ emitEvent: false })
            : this.group.enable({ emitEvent: false });
    }

    public writeValue(value: XmDateRangeValueOrString): void {
        this.syncValue(value);

        super.writeValue(value);
    }

    public change(value: XmDateRangeValueOrString): void {
        this._onChange(value);
        this.valueChange.next(value);
    }

    public clear(): void {
        this.group.reset(null, {emitEvent: true});
        this.change(null);
    }

    public dateChanged(): void {
        this.refreshDate.next();
    }

    public defineStartDate(): Date | undefined {
        if (this.config?.intervalFromMinDateInDays) {
            const startDate = new Date();
            const midNightHours = this.config?.intervalFromMinDateInDays*24;
            startDate.setHours( midNightHours,0,0,0);
            return new Date(startDate);
        }

        return undefined;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private syncValue(dates: XmDateRangeValueOrString): void {
        let model: XmDateRangeValueOrString;

        if (this.config.valueType === 'string') {
            model = this.transformDateStringCodec.toModel(dates);
        } else {
            if (typeof dates === 'string') {
                throw new Error('XmDateRangeControl dates type is string, make sure that value is object or config.valueType="string".');
            } else {
                model = {
                    from: dates?.from ? new Date(dates.from) : undefined,
                    to: dates?.to ? new Date(dates.to) : undefined,
                };
            }
        }

        if (!model) {
            this.group.reset();
        } else if (typeof model !== 'string') {
            this.group.patchValue(model, { emitEvent: false });
        }
    }
}
