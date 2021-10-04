import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Optional, Self, ViewEncapsulation } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTextTitleOptions } from '../text-title';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

export interface XmTextControlOptions extends XmTextTitleOptions, DataQa {
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
    isTrimmingString?: boolean,
}

const XM_TEXT_CONTROL_OPTIONS_DEFAULT: XmTextControlOptions = {
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
    isTrimmingString: false,
};

@Component({
    selector: 'xm-text-control',
    template: `
        <mat-form-field>
            <mat-label>{{options.title | translate}}</mat-label>

            <input matInput
                   [formControl]="formControl"
                   [placeholder]="options.placeholder | translate"
                   [attr.name]="options.name"
                   [id]="options.id"
                   [attr.data-qa]="options.dataQa"
                   [required]="options.required"
                   [pattern]="options.pattern"
                   [attr.maxlength]="options.maxLength"
                   [attr.minlength]="options.minLength"
                   [attr.type]="options.type">

            <mat-error
                *xmControlErrors="control.errors; translates options?.errors; message as message">{{message}}</mat-error>

            <mat-hint *ngIf="options.maxLength"
                      align="end">{{getValueLength()}} / {{options.maxLength}}</mat-hint>

        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmTextControl<T = Primitive> extends NgFormAccessor<T>
    implements XmDynamicControl<T, XmTextControlOptions>, OnInit, OnDestroy {
    public newControl: FormControl = new FormControl();

    public get formControl(): FormControl {
        return this.options.isTrimmingString ? this.newControl : this.control;
    }

    private _options: XmTextControlOptions = clone(XM_TEXT_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmTextControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmTextControlOptions) {
        this._options = defaults({}, value, {
            ...XM_TEXT_CONTROL_OPTIONS_DEFAULT,
            errors: this.xmControlErrorsTranslates,
        });
        this._options.placeholder = this._options.placeholder || this._options.title;

        if (this._options.disabled) {
            this.disabled = value.disabled;
        }
    }

    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) private xmControlErrorsTranslates: { [errorKey: string]: Translate }) {
        super(ngControl);
    }

    public ngOnInit(): void {
        if(this.options.isTrimmingString) {
            this.initControlWithTrimmingString();
        }
    }

    public getValueLength(): number {
        if (this.value && typeof this.value === 'string') {
            return this.value.length;
        }
        return 0;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private initControlWithTrimmingString(): void {
        this.newControl.patchValue(this.value);
        this.newControl.valueChanges
            .pipe(
                takeUntilOnDestroy(this),
            )
            .subscribe((value: string) => {
                this.control.patchValue(value?.trim());
            });
    }
}

