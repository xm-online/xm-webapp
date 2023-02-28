import { CommonModule } from '@angular/common';
import { Component, Inject, Input, NgModule, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlErrorModule, XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { XmControlErrorsTranslates } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl, XmDynamicControlConstructor, XmDynamicEntryModule } from '@xm-ngx/dynamic';
import { LanguageService, Translate, XmTranslationModule } from '@xm-ngx/translation';
import { defaults } from 'lodash';
import { XmDateValue } from './xm-date.component';

import { DateAdapter } from '@angular/material/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { filter } from 'rxjs/operators';

import { HintModule, HintText } from '@xm-ngx/components/hint';


export interface XmDateControlOptions {
    hint?: HintText;
    title: Translate;
    name?: string;
    required?: boolean;
    useUtc?: boolean;
    errors?: XmControlErrorsTranslates;
    disableFutureDates?: boolean;
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
                   [min]="config?.dateNow ? dateNow : undefined"
                   [max]="maxDate"
                   [matDatepicker]="picker"
                   [name]="config?.name"
                   [required]="config?.required"
                   (click)="picker.open()">
            <mat-datepicker-toggle [for]="picker" matSuffix></mat-datepicker-toggle>

            <mat-datepicker #picker></mat-datepicker>

            <mat-error *xmControlErrors="control?.errors; translates config?.errors; message as message">
                {{message}}
            </mat-error>

            <button mat-button
                    *ngIf="value"
                    matSuffix
                    mat-icon-button
                    [disabled]="control.disabled"
                    aria-label="Clear"
                    (click)="control.patchValue(''); control.markAsDirty()">
                <mat-icon>close</mat-icon>
            </button>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
})
export class XmDateControl extends NgFormAccessor<XmDateValue> implements OnInit, OnDestroy {
    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: { [errorKey: string]: Translate },
                private dateAdapter: DateAdapter<Date>,
                private languageService: LanguageService) {
        super(ngControl);
    }

    public dateNow = new Date(Date.now());

    public maxDate: Date | null;

    private _config: XmDateControlOptions = DEFAULT_CONFIG;

    @Input()
    public set config(value: XmDateControlOptions) {
        this._config = defaults(value, {
            ...DEFAULT_CONFIG,
            errors: this.xmControlErrorsTranslates,
        });

        this.maxDate = this.disablingFutureDates();
    }

    public get config(): XmDateControlOptions {
        return this._config;
    }

    public disablingFutureDates(): Date | null {
        const maxDate = new Date();

        return this.config?.disableFutureDates ? maxDate : null;
    }

    public ngOnInit(): void {
        this.languageService.locale$.pipe(
            filter(Boolean),
            takeUntilOnDestroy(this),
        ).subscribe(locale => {
            this.dateAdapter.setLocale(locale);
        });
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}

@NgModule({
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
    exports: [XmDateControl],
    declarations: [XmDateControl],
})
export class XmDateControlModule implements XmDynamicEntryModule<XmDynamicControl<XmDateValue, XmDateControlOptions>> {
    public entry: XmDynamicControlConstructor<XmDateValue, XmDateControlOptions> = XmDateControl;
}
