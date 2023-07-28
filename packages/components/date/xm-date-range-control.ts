import {
    AfterViewInit,
    Component,
    Inject,
    Input,
    LOCALE_ID,
    OnDestroy,
    Optional,
    Self,
} from '@angular/core';
import { NgControl, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { template } from 'lodash/fp';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { Subject, filter, map } from 'rxjs';
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

export type XmDateRangeValue = XmDateValue | number;

export type XmDateRangeControlValue = {
    from: XmDateRangeValue;
    to: XmDateRangeValue;
};

export type XmDateRangeValueOrString = XmDateRangeControlValue | string;

export const XM_DATE_RANGE_CONTROL_OPTIONS: XmDateRangeControlOptions = {
    hint: null,
    title: '',
    format: 'y-MM-dThh:mm:ss',
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
            <mat-label>{{config?.title | translate}}</mat-label>
            <mat-date-range-input [formGroup]="group"
                                  [rangePicker]="picker">
                <input matStartDate
                       (dateChange)="dateChanged()"
                       (focus)="picker.open()"
                       [name]="config?.fromName ?? 'from'"
                       formControlName="from">
                <input matEndDate
                       (dateChange)="dateChanged()"
                       (focus)="picker.open()"
                       formControlName="to"
                       [name]="config?.toName ?? 'to'">
            </mat-date-range-input>

            <span matSuffix class="d-flex">
                <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
                <button mat-icon-button *ngIf="value !== null" (click)="clear()">
                    <mat-icon>close</mat-icon>
                </button>
            </span>

            <mat-date-range-picker #picker></mat-date-range-picker>

            <mat-error *xmControlErrors="group?.errors || group?.controls.from?.errors || group?.controls.to?.errors; message as message">{{message}}</mat-error>
            <mat-hint [hint]="config?.hint"></mat-hint>
        </mat-form-field>
    `,
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
    standalone: true,
})
export class XmDateRangeControl extends NgControlAccessor<XmDateRangeValueOrString> implements AfterViewInit, OnDestroy {
    private refreshDate = new Subject<void>();

    private _config: XmDateRangeControlOptions;

    @Input() public set config(options: XmDateRangeControlOptions) {
        this._config = _.defaultsDeep(options, XM_DATE_RANGE_CONTROL_OPTIONS);
    }
    public get config(): XmDateRangeControlOptions {
        return this._config;
    }

    @Input() public group = new FormGroup({
        from: new FormControl<XmDateRangeValue>(''),
        to: new FormControl<XmDateRangeValue>(''),
    });

    constructor(
        @Inject(LOCALE_ID) public locale: string,
        @Optional() @Self() public ngControl: NgControl,
    ) {
        super(ngControl);
    }

    private syncValue(value: XmDateRangeValueOrString): void {
        const model = this.toModel(value);

        if (!model) {
            this.group.reset();
        } else if (typeof model !== 'string') {
            this.group.patchValue(model, { emitEvent: false });
        }
    }

    public ngAfterViewInit(): void {
        this.refreshDate.pipe(
            map(() => this.group.value),
            filter(({ to }) => !!to),
            takeUntilOnDestroy(this),
        ).subscribe((dates) => {
            const value = this.fromModel(dates as XmDateRangeControlValue);

            this.change(value);
        });
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
        this.group.reset();
        this.change(null);
    }

    private toModel(value: XmDateRangeValueOrString): XmDateRangeControlValue {
        if (typeof value === 'string') {
            if (!this.config?.transform) {
                return {
                    from: null,
                    to: null,
                };
            }

            const [from, to] = value
                ?.split(` ${this.getSeparator()} `)
                ?.map(x => _.trim(x, this.buildQuotedString(' ')));

            if (_.isEmpty(from) && _.isEmpty(to)) {
                return {
                    from: null,
                    to: null,
                };
            }

            const { from: normalizeFrom, to: normalizeTo } = this.normalizeDates({ from, to });

            return {
                from: new Date(normalizeFrom),
                to: new Date(normalizeTo),
            };
        }

        return value;
    }

    private fromModel(dates: XmDateRangeControlValue): string {
        if (!this.config?.transform) {
            return '';
        }

        const templateFn = template(this.buildQuotedString('${from} ' + this.getSeparator() + ' ${to}'));

        if (templateFn) {
            return templateFn(this.normalizeDates(dates));
        }

        return '';
    }

    private normalizeDates({ from, to }: XmDateRangeControlValue): XmDateRangeControlValue {
        if (this.config.format === 'timestamp') {
            const fromFormat = formatDate(from, 'shortDate', 'en');
            const toFormat = formatDate(to, 'shortDate', 'en');

            return {
                from: new Date(fromFormat).getTime(),
                to: new Date(toFormat).getTime(),
            };
        }

        const fromFormat = formatDate(from, this.config.format, this.locale);
        const toFormat = formatDate(to, this.config.format, this.locale);

        return {
            from: fromFormat,
            to: toFormat,
        };
    }

    private buildQuotedString(str: string): string {
        const { quotes: [prepend, append] } = this.config.transform;

        return `${prepend}${str}${append}`;
    }

    private getSeparator(): string {
        const { separator } = this.config.transform;
        return separator;
    }

    public dateChanged(): void {
        this.refreshDate.next();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
