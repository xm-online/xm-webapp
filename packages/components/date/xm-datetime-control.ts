import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, Input, LOCALE_ID, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormsModule, NgControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInput, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule, XmControlErrorsTranslates, XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { HintModule } from '@xm-ngx/components/hint';
import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { distinctUntilChanged, Subject, tap } from 'rxjs';
import { NgxMaskModule } from 'ngx-mask';
import _ from 'lodash';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';

export interface XmDateTimeControlConfig {
    title?: Translate;
    hint?: Translate;
    errors?: XmControlErrorsTranslates;
    required?: boolean;
}

export type XmDateTimeControlValue = Date | string | number | null;

export interface XmDateTimeControlParts {
    date: string;
    time: string;
}

export type XmDateTimeFormGroup = {
    date: FormControl<string | number | Date>;
    time: FormControl<string>;
};

export function parseTime(value: string): { hours: number; minutes: number; } {
    let time = /(\d?\d):?(\d?\d?)/.exec(value);

    let h = parseInt(time[1], 10);
    let m = parseInt(time[2], 10) || 0;

    if (h > 24) {
        time = /(\d)(\d?\d?)/.exec(value);

        h = parseInt(time[1], 10);
        m = parseInt(time[2], 10) || 0;
    }

    return {
        hours: h,
        minutes: m,
    };
}

const dateTimeValidator = (localeId: string) => {
    return (control: AbstractControl<{ date: XmDateTimeControlValue; time: string; }>): ValidationErrors | null => {
        const { date, time } = control.value;

        if (_.isEmpty(date) && _.isEmpty(time)) {
            return { 'datetime': true };
        }

        try {
            formatDate(date, 'fullDate', localeId);
        } catch (error) {
            return { 'datetime': true };
        }

        return null;
    };
};

@Component({
    selector: 'xm-datetime-control-field',
    exportAs: 'dateTimeField',
    standalone: true,
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        ReactiveFormsModule,
        XmTranslationModule,
        ControlErrorModule,
        MatButtonModule,
        CommonModule,
        MatIconModule,
        HintModule,
        NgxMaskModule,
    ],
    providers: [
        {
            provide: MatFormFieldControl,
            useExisting: XmDateTimeControlFieldComponent,
        },
    ],
    template: `
        <div
            class="xm-datetime-group"
            role="group"
            [formGroup]="datetime"
            (focusin)="onFocusIn()"
            (focusout)="onFocusOut($event)">

            <span class="xm-datetime-date">
                <input
                    matInput
                    formControlName="date"
                    placeholder="DD/MM/YYYY"
                    [matDatepicker]="picker"
                    (focus)="picker.open()"
                    #dateInputRef />
            </span>
            <span class="me-1 ms-1"></span>
            <span class="xm-datetime-time">
                <input
                    matInput
                    formControlName="time"
                    placeholder="00:00"
                    mask="Hh:m0"
                    [validation]="true"
                    (keyup.backspace)="autoFocusPrev(datetime.controls.time, dateInputRef)"
                    #timeInputRef />
            </span>
        </div>
    `,
    styles: [`
        .xm-datetime-group {
            display:flex;
            justify-content: space-between;
        }

        .xm-datetime-date {
            flex: 1;
        }

        .xm-datetime-time {
            width: 45px;
        }
    `],
})
export class XmDateTimeControlFieldComponent implements ControlValueAccessor, MatFormFieldControl<XmDateTimeControlValue>, AfterViewInit, OnInit, OnDestroy {
    public static nextId = 0;

    @ViewChild('dateInputRef') public dateInput: ElementRef<HTMLInputElement>;
    @ViewChild('timeInputRef') public timeInput: ElementRef<HTMLInputElement>;

    private fb = inject(FormBuilder);
    private focusMonitor = inject(FocusMonitor);
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private localeId = inject(LOCALE_ID);

    public formField = inject(MatFormField, { optional: true });
    public ngControl = inject(NgControl, { optional: true, self: true });

    public datetime = this.fb.group<XmDateTimeFormGroup>({
        date: this.fb.control(''),
        time: this.fb.control(''),
    }, {
        validators: [dateTimeValidator(this.localeId)],
    });

    public stateChanges = new Subject<void>();
    public focused = false;
    public touched = false;
    public controlType = 'datetime-control';
    public id = `datetime-control-${XmDateTimeControlFieldComponent.nextId++}`;

    get empty(): boolean {
        const {
            value: { date, time },
        } = this.datetime;

        return !date && !time;
    }

    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    @Input() public picker: MatDatepickerPanel<MatDatepickerInput<any>, any>;

    @Input()
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    get placeholder(): string {
        return this._placeholder;
    }
    private _placeholder: string;

    @Input()
    set required(value: BooleanInput) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    get required(): boolean {
        return this._required;
    }
    private _required = false;

    @Input()
    set disabled(value: BooleanInput) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.datetime.disable({ emitEvent: false }) : this.datetime.enable({ emitEvent: false });
        this.stateChanges.next();
    }
    get disabled(): boolean {
        return this._disabled;
    }
    private _disabled = false;

    @Input()
    set value(value: XmDateTimeControlValue) {
        const date = value ? new Date(value) : null;

        if (_.isDate(date)) {
            const h = date.getHours();
            const m = date.getMinutes();

            const hh = h < 10 ? `0${h}` : h;
            const mm = m < 10 ? `0${m}` : m;

            this.datetime.setValue({
                date: date,
                time: `${hh}:${mm}`,
            }, { emitEvent: false });
        } else {
            this.datetime.setValue({ date: '', time: '' }, { emitEvent: false });
        }

        this.stateChanges.next();
    }

    // Display parent errors
    @Input() public hasErrors: ValidationErrors | null;

    get errorState(): boolean {
        return (this.datetime.invalid && this.touched) || (this.hasErrors != null);
    }

    constructor() {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    public ngOnInit(): void {
        this.datetime.statusChanges.pipe(
            tap(() => {
                const errors = this.getNestedErrors(this.datetime.errors);

                this.ngControl.control.setErrors(errors);
                this.ngControl.control.updateValueAndValidity();
            }),
            takeUntilOnDestroy(this),
        ).subscribe();

        this.datetime.valueChanges.pipe(
            distinctUntilChanged(),
            tap(() => {
                this.change();

                // Run mat-form-field change detection
                this.stateChanges.next();
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    public ngAfterViewInit(): void {
        this.picker.datepickerInput.dateChange
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => {
                this.autoFocusNext(this.datetime.controls.date, this.timeInput.nativeElement);
            });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);

        this.stateChanges.complete();
        this.focusMonitor.stopMonitoring(this.elementRef);
    }

    private getNestedErrors(groupErrors: ValidationErrors | null): Record<string, ValidationErrors> | null {
        const errors = Object.entries(this.datetime.controls).reduce((acc, [controlName, control]) => {
            if (control.errors != null) {
                return {
                    ...acc,
                    [controlName]: control.errors,
                };
            }

            return acc;
        }, _.clone(groupErrors) ?? {});

        return Object.keys(errors).length > 0 ? errors : null;
    }

    public onFocusIn(): void {
        if (!this.focused) {
            this.focused = true;
            this.stateChanges.next();
        }
    }

    public onFocusOut(event: FocusEvent): void {
        if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
            this.touched = true;
            this.focused = false;
            this.onTouched();
            this.stateChanges.next();
        }
    }

    public autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
        if (!control.errors && nextElement) {
            this.focusMonitor.focusVia(nextElement, 'program');
        }
    }

    public autoFocusPrev(control: AbstractControl<string>, prevElement: HTMLInputElement): void {
        if (control.value.length < 1) {
            this.focusMonitor.focusVia(prevElement, 'program');
        }
    }

    public onContainerClick(): void {
        if (this.datetime.controls.date.valid) {
            this.focusMonitor.focusVia(this.timeInput, 'program');
        } else {
            this.focusMonitor.focusVia(this.dateInput, 'program');
        }
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(value: XmDateTimeControlValue): void {
        this.value = value;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // eslint-disable-next-line
    public setDescribedByIds(ids: string[]): void {}

    // eslint-disable-next-line
    public onChange = (_: any): void => {};

    // eslint-disable-next-line
    public onTouched = (): void => {};

    public change(): void {
        const {
            valid,
            value: { date: pickerDate, time },
        } = this.datetime;

        if (!valid) {
            this.onChange('');
            return;
        }

        let date: Date;

        try {
            date = new Date(pickerDate);
        } catch (error) {
            console.warn(error);
        }

        const { hours, minutes } = parseTime(time);

        date.setHours(hours, minutes);

        this.onChange(date);
    }

    public reset(): void {
        this.datetime.reset({ date: '', time: ''});
    }
}

@Component({
    selector: 'xm-datetime-control',
    standalone: true,
    imports: [
        XmDateTimeControlFieldComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatInputModule,
        XmTranslationModule,
        ControlErrorModule,
        MatButtonModule,
        CommonModule,
        FormsModule,
        MatIconModule,
        HintModule,
    ],
    template: `
        <mat-form-field>
            <mat-label *ngIf="config?.title">{{config.title | translate}}</mat-label>
            <xm-datetime-control-field
                #field="dateTimeField"
                [picker]="picker"
                [hasErrors]="ngControl?.control?.errors"
                [ngModel]="value"
                [disabled]="disabled"
                [required]="config?.required"
                (ngModelChange)="change($event)">
            </xm-datetime-control-field>

            <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
            <button mat-icon-button matSuffix [disabled]="disabled" *ngIf="!field?.empty" (click)="field.reset()">
                <mat-icon>close</mat-icon>
            </button>
            <mat-datepicker restoreFocus="false" #picker></mat-datepicker>

            <mat-hint [hint]="config?.hint"></mat-hint>

            <mat-error
                *xmControlErrors="getAllErrors(field?.ngControl?.control, ngControl?.control); translates (config.errors || messageErrors); message as message">{{message}}</mat-error>
        </mat-form-field>
    `,
})
export class XmDateTimeControlComponent extends NgModelWrapper<XmDateTimeControlValue> {
    public ngControl = inject(NgControl, { optional: true, self: true });
    public messageErrors = inject<XmControlErrorsTranslates>(XM_CONTROL_ERRORS_TRANSLATES);

    @Input() public config: XmDateTimeControlConfig;

    constructor() {
        super();

        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    public getAllErrors(c1: AbstractControl<unknown>, c2: AbstractControl<unknown>): ValidationErrors | null {
        return {
            ...(c1?.errors ?? {}),
            ...(c2?.errors ?? {}),
        };
    }
}
