import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ControlErrorModule, XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTextTitleOptions } from '../text-title';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { ValidatorProcessingOption, ValidatorProcessingService } from '@xm-ngx/components/validator-processing';
import { filter } from 'rxjs/operators';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface XmTextControlOptions extends XmTextTitleOptions, DataQa {
    hint?: HintText;
    type?: string;
    placeholder?: Translate;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: { [errorKey: string]: Translate };
    maxLength?: number;
    minLength?: number;
    applyTrimForValue?: boolean;
    validators?: ValidatorProcessingOption[];
    clearButton?: boolean;
}

const XM_TEXT_CONTROL_OPTIONS_DEFAULT: XmTextControlOptions = {
    hint: null,
    title: '',
    placeholder: '',
    type: 'text',
    pattern: '',
    id: null,
    name: 'text',
    required: true,
    disabled: false,
    maxLength: null,
    minLength: null,
    dataQa: 'text-control',
    applyTrimForValue: false,
    clearButton: false,
};

@Component({
    selector: 'xm-text-control',
    template: `
        <mat-form-field>
            <mat-label>{{config.title | translate}}</mat-label>

            <input matInput
                   [formControl]="formControl"
                   [placeholder]="config.placeholder | translate"
                   [attr.name]="config.name"
                   [id]="config.id"
                   [attr.data-qa]="config.dataQa"
                   [required]="config.required"
                   [pattern]="config.pattern"
                   [attr.maxlength]="config.maxLength"
                   [attr.minlength]="config.minLength"
                   [attr.type]="config.type">
            <button mat-icon-button matSuffix *ngIf="config.clearButton && value !== null" (click)="change(null)">
                <mat-icon>close</mat-icon>
            </button>
            <mat-error
                *xmControlErrors="formControl.errors; translates config?.errors; message as message">{{message}}</mat-error>

            <mat-hint
            *ngIf="config.maxLength"
            align="end"
            style="min-width: fit-content">
                {{getValueLength()}} / {{config.maxLength}}
            </mat-hint>

            <mat-hint [hint]="config.hint"></mat-hint>

        </mat-form-field>
    `,
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        HintModule,
        MatIconModule,
        MatButtonModule,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmTextControl<T = Primitive> extends NgFormAccessor<T>
    implements XmDynamicControl<T, XmTextControlOptions>, OnInit, OnDestroy {
    private _config: XmTextControlOptions = clone(XM_TEXT_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmTextControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextControlOptions) {
        this._config = defaults({}, value, {
            ...XM_TEXT_CONTROL_OPTIONS_DEFAULT,
            errors: this.xmControlErrorsTranslates,
        });
        this._config.placeholder = this._config.placeholder || this._config.title;

        if (this._config.disabled) {
            this.disabled = value.disabled;
        }
    }

    public get formControl(): UntypedFormControl {
        return this.config.applyTrimForValue ? this.newControl : this.control;
    }

    private newControl: UntypedFormControl = new UntypedFormControl();

    constructor(
        @Optional() @Self() public ngControl: NgControl | null,
        @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: { [errorKey: string]: Translate },
        private validatorProcessingService: ValidatorProcessingService,
    ) {
        super(ngControl);
    }

    public ngOnInit(): void {
        if(this.config.applyTrimForValue) {
            this.initControlWithTrimmingString();
        }
    }

    public getValueLength(): number {
        return this.value && typeof this.value === 'string' ? this.value.length : 0;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private initControlWithTrimmingString(): void {
        this.newControl = new UntypedFormControl(
            this.value,
            this.validatorProcessingService.validatorsFactory(this.config?.validators),
        );

        this.newControl.valueChanges
            .pipe(
                takeUntilOnDestroy(this),
                filter(() => this.newControl.valid),
            )
            .subscribe((value: string) => {
                this.control.patchValue(value?.trim());
            });

        this.control.valueChanges
            .pipe(
                takeUntilOnDestroy(this),
                filter((value) => !value),
            )
            .subscribe(() => {
                this.newControl.patchValue(null, {emitEvent: false});
            });
    }

}

