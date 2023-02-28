import { ChangeDetectionStrategy, Component, Inject, Input, Optional, Self, ViewEncapsulation, } from '@angular/core';
import { NgControl } from '@angular/forms';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';

import { XmDynamicControl } from '@xm-ngx/dynamic';
import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { defaults } from 'lodash';
import { HintText } from '@xm-ngx/components/hint';

import { XmNumberSystemType } from './xm-number.directive';

export interface XmNumberControlOptions extends DataQa {
    hint?: HintText;
    title?: Translate;
    placeholder?: Translate;
    pattern?: string;
    id?: string;
    name?: string;
    required?: boolean;
    step?: number;
    errors?: { [errorKey: string]: Translate };
    type?: XmNumberSystemType
}

const XM_NUMBER_CONTROL_DEFAULT_OPTIONS: XmNumberControlOptions = {
    hint: null,
    title: '',
    placeholder: '',
    pattern: '',
    id: null,
    dataQa: 'number-control',
    name: 'number',
    required: true,
    type: XmNumberSystemType.Rational,
    step: 1,
};

@Component({
    selector: 'xm-number-control',
    template: `
        <mat-form-field>
            <mat-label>{{config.title | translate}}</mat-label>

            <input matInput
                   [formControl]="control"
                   [placeholder]="config.placeholder | translate"
                   [name]="config.name"
                   [id]="config.id"
                   [required]="config.required"
                   [pattern]="config.pattern"
                   [xm-number]="config.type"
                   [step]="config.step"
                   type="number">

            <mat-error *xmControlErrors="control.errors; translates config?.errors; message as message">
                {{message}}
            </mat-error>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmNumberControl extends NgFormAccessor<Primitive> implements XmDynamicControl<Primitive, XmNumberControlOptions> {
    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) protected xmControlErrorsTranslates: { [errorKey: string]: Translate }) {
        super(ngControl);
    }

    private _config: XmNumberControlOptions = XM_NUMBER_CONTROL_DEFAULT_OPTIONS;

    public get config(): XmNumberControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmNumberControlOptions) {
        this._config = defaults({}, value, {
            ...XM_NUMBER_CONTROL_DEFAULT_OPTIONS,
            errors: this.xmControlErrorsTranslates,
        });
        this._config.placeholder = this._config.placeholder || this._config.title;
    }
}

