import { CommonModule, formatDate } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ElementRef,
    inject, input,
    Input,
    LOCALE_ID,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormsModule,
    NgControl,
    ReactiveFormsModule,
    ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInput, MatDatepickerModule, MatDatepickerPanel } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
    ControlErrorModule,
    XM_CONTROL_ERRORS_TRANSLATES,
    XmControlErrorsTranslates,
} from '@xm-ngx/components/control-error';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { NgModelWrapper } from '@xm-ngx/components/ng-accessor';
import { HintModule } from '@xm-ngx/components/hint';
import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { distinctUntilChanged, Subject, tap } from 'rxjs';
import { NgxMaskModule } from 'ngx-mask';
import { clone, isDate, isEmpty } from 'lodash';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { parseTime } from './shared/parse-time';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from './shared/custom-date-adapter';

export interface XmDateTimeControlConfig {
    title?: Translate;
    hint?: Translate;
    errors?: XmControlErrorsTranslates;
    required?: boolean;
    disableDateTimeValidator?: boolean;
}

export type XmDateTimePickerFilter = (date: Date | null) => boolean;

export type XmDateTimeControlValue = Date | string | number;

export interface XmDateTimeControlParts {
    date: string;
    time: string;
}

export type XmDateTimeFormGroup = {
    date: FormControl<string | number | Date>;
    time: FormControl<string>;
};

const dateTimeValidator = (localeId: string) => {
    return (control: AbstractControl<{ date: XmDateTimeControlValue; time: string; }>): ValidationErrors | null => {
        const {date, time} = control.value;

        if (isEmpty(date) && isEmpty(time)) {
            return {'datetime': true};
        }

        try {
            formatDate(date, 'fullDate', localeId);
        } catch (error) {
            return {'datetime': true};
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
        {
            provide: DateAdapter,
            useClass: CustomDateAdapter,
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
                    placeholder="DD.MM.YYYY"
                    [matDatepicker]="picker"
                    [matDatepickerFilter]="pickerFilter"
                    (focus)="picker.open()"
                    #dateInputRef/>
            </span>
            <span class="me-1 ms-1"></span>
            <span class="xm-datetime-time">
                <input
                    matInput
                    formControlName="time"
                    placeholder="00:00:00"
                    mask="Hh:m0||Hh:m0:s0"
                    [validation]="true"
                    (keyup.backspace)="autoFocusPrev(datetime.controls.time, dateInputRef)"
                    #timeInputRef/>
            </span>
        </div>
    `,
    styles: [`
        .xm-datetime-group {
            display: flex;
            justify-content: space-between;
        }

        .xm-datetime-date {
            flex: 1;
        }

        .xm-datetime-time {
            width: 65px;
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

    public formField = inject(MatFormField, {optional: true});
    public ngControl = inject(NgControl, {optional: true, self: true});

    public dateControl = this.fb.nonNullable.control('');
    public timeControl = this.fb.nonNullable.control('');

    public disableDateTimeValidator = input<boolean>(false);
    public datetime = this.fb.group<XmDateTimeFormGroup>({
        date: this.dateControl,
        time: this.timeControl,
    });

    public stateChanges = new Subject<void>();
    public focused = false;
    public touched = false;
    public controlType = 'datetime-control';
    public id = `datetime-control-${XmDateTimeControlFieldComponent.nextId++}`;

    get empty(): boolean {
        const {
            value: {date, time},
        } = this.datetime;

        return !date && !time;
    }

    get shouldLabelFloat(): boolean {
        return this.focused || !this.empty;
    }

    @Input() public pickerFilter: XmDateTimePickerFilter;
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
        this._disabled ? this.datetime.disable({emitEvent: false}) : this.datetime.enable({emitEvent: false});
        this.stateChanges.next();
    }

    get disabled(): boolean {
        return this._disabled;
    }

    private _disabled = false;

    @Input()
    set value(value: XmDateTimeControlValue) {
        this.syncValue(value);
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

                if (!this.ngControl?.control) {
                    return;
                }

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
                this.autoFocusNext(this.dateControl, this.timeInput.nativeElement);
            });

        if (this.disableDateTimeValidator()) {
            return;
        }
        this.datetime.addValidators(dateTimeValidator(this.localeId));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);

        this.stateChanges.complete();
        this.focusMonitor.stopMonitoring(this.elementRef);
    }

    private syncValue(value: XmDateTimeControlValue): void {
        const date = value ? new Date(value) : null;

        if (isDate(date)) {
            const time = this.getTimeOfDate(date);

            this.datetime.setValue({
                date: date,
                time,
            }, {emitEvent: false});
        } else {
            this.datetime.setValue({date: '', time: ''}, {emitEvent: false});
        }

        this.stateChanges.next();
    }

    private getTimeOfDate(date?: Date): string {
        if (!isDate(date)) {
            return '';
        }

        const h = date.getHours();
        const m = date.getMinutes();
        const s = date.getSeconds();

        const hh = h < 10 ? `0${h}` : h;
        const mm = m < 10 ? `0${m}` : m;
        const ss = s < 10 ? `0${s}` : s;

        return `${hh}:${mm}:${ss}`;
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
        }, clone(groupErrors) ?? {});

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
        const {value: pickerDate, valid: validDate} = this.dateControl;

        if (isDate(pickerDate) && validDate) {
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
    public setDescribedByIds(ids: string[]): void {
    }

    // eslint-disable-next-line
    public onChange = (_: any): void => {
    };

    // eslint-disable-next-line
    public onTouched = (): void => {
    };

    public change(): void {
        const {value: pickerDate} = this.dateControl;
        const {value: pickerTime, valid: validTime} = this.timeControl;

        const date = new Date(pickerDate);

        if (!this.isValidDate(date)) {
            this.onChange('');
            return;
        }

        if (isEmpty(pickerTime)) {
            this.onChange(date);
            return;
        }

        if (validTime) {
            const {hours, minutes, seconds} = parseTime(pickerTime);

            date.setHours(hours, minutes, seconds);
        } else {
            date.setHours(0, 0, 0);
        }

        this.onChange(date);
    }

    public reset(): void {
        this.datetime.reset({date: '', time: ''});
    }

    public isValidDate(value: Date | string): boolean {
        return isDate(value) && !isNaN(value.getTime());
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
            <mat-label (click)="field.onContainerClick()" *ngIf="config?.title">{{ config.title | translate }}
            </mat-label>
            <xm-datetime-control-field
                #field="dateTimeField"
                [picker]="picker"
                [pickerFilter]="pickerFilter"
                [hasErrors]="ngControl?.control?.errors"
                [ngModel]="value"
                [ngModelOptions]="{ standalone: true }"
                [disabled]="disabled"
                [required]="config?.required"
                [disableDateTimeValidator]="config?.disableDateTimeValidator"
                (ngModelChange)="change($event)">
            </xm-datetime-control-field>

            <mat-datepicker-toggle matIconPrefix [for]="picker"></mat-datepicker-toggle>
            <button mat-icon-button matSuffix [disabled]="disabled" *ngIf="!field?.empty" (click)="field.reset()">
                <mat-icon>close</mat-icon>
            </button>
            <mat-datepicker restoreFocus="false" #picker></mat-datepicker>

            <mat-hint [hint]="config?.hint"></mat-hint>

            <mat-error
                *xmControlErrors="getAllErrors(field?.ngControl?.control, ngControl?.control); translates (config?.errors || messageErrors); message as message">{{ message }}
            </mat-error>
        </mat-form-field>
    `,
})
export class XmDateTimeControlComponent extends NgModelWrapper<XmDateTimeControlValue> {
    public ngControl = inject(NgControl, {optional: true, self: true});
    public messageErrors = inject<XmControlErrorsTranslates>(XM_CONTROL_ERRORS_TRANSLATES);

    @Input() public pickerFilter: XmDateTimePickerFilter;
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
