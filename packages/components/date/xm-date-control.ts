import { CommonModule } from '@angular/common';
import { Component, Inject, Input, Optional, Self } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule, XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { XmControlErrorsTranslates } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';
import { XmDateValue } from './xm-date.component';
import { HintModule, HintText } from '@xm-ngx/components/hint';

export interface XmDateControlOptions {
    hint?: HintText;
    title: Translate;
    name?: string;
    required?: boolean;
    useUtc?: boolean;
    errors?: XmControlErrorsTranslates;
    disableFutureDates?: boolean;
    intervalFromMinDateInDays?: number;
    dateNow?: boolean;
}

const DEFAULT_CONFIG: XmDateControlOptions = {
    hint: null,
    title: null,
    name: null,
    required: null,
    useUtc: null,
    errors: null,
};

@Component({
    selector: 'xm-date-control',
    template: `
        <mat-form-field>
            <mat-label>{{config?.title | translate}}</mat-label>

            <input matInput
                   (dateChange)="changeDateControl($event)"
                   [formControl]="control"
                   [min]="minDate"
                   [max]="maxDate"
                   [matDatepicker]="picker"
                   [name]="config?.name"
                   [required]="config?.required"
                   (click)="picker.open()">

            <div matSuffix class="d-flex">
                <button *ngIf="value && !disabled"
                        mat-icon-button
                        [disabled]="control.disabled"
                        aria-label="Clear"
                        (click)="control.patchValue(''); control.markAsDirty()">
                    <mat-icon>close</mat-icon>
                </button>

                <mat-datepicker-toggle [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
            </div>

            <mat-error *xmControlErrors="control?.errors; translates config?.errors; message as message">
                {{message}}
            </mat-error>

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
        MatButtonModule,
        CommonModule,
        MatIconModule,
        HintModule,
    ],
    standalone: true,
})
export class XmDateControl extends NgFormAccessor<XmDateValue> {
    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: {[errorKey: string]: Translate}) {
        super(ngControl);
    }

    public maxDate: Date | null;
    public minDate: Date | null;

    private _config: XmDateControlOptions = DEFAULT_CONFIG;

    @Input()
    public set config(value: XmDateControlOptions) {
        this._config = defaults(value, {
            ...DEFAULT_CONFIG,
            errors: this.xmControlErrorsTranslates,
        });

        this.maxDate = this.disableFutureDates();
        this.minDate = this.defineStartDate();
    }

    public get config(): XmDateControlOptions {
        return this._config;
    }

    public disableFutureDates(): Date | null {
        const maxDate = new Date();

        return this.config?.disableFutureDates ? maxDate : null;
    }

    public defineStartDate(): Date | null {
        let minDate: Date;
        if (this.config?.intervalFromMinDateInDays) {
            const startDate = new Date();
            startDate.setHours( this.config?.intervalFromMinDateInDays*24,0,0,0);//set hours at midnight
            minDate = new Date(startDate);
        } else {
            minDate = new Date(Date.now());
        }

        return this.config?.dateNow ? minDate : undefined;
    }

    public changeDateControl({ value }: MatDatepickerInputEvent<unknown>): void {
        if (value instanceof Date) {
            if (this.config?.useUtc) {
                const utcDate = new Date(
                    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
                );
                this.control.setValue(utcDate, { emitEvent: true });
                this.control.markAsTouched();
                this.control.markAsDirty();
            }
        } else if (value === null) {
            this.control.setValue('', { emitEvent: true });
            this.control.markAsTouched();
            this.control.markAsDirty();
        }
    }
}
