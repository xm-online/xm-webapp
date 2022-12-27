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
            <mat-label>{{options.title | translate}}</mat-label>

            <input matInput
                   [formControl]="control"
                   [placeholder]="options.placeholder | translate"
                   [name]="options.name"
                   [id]="options.id"
                   [required]="options.required"
                   [pattern]="options.pattern"
                   [xm-number]="options.type"
                   [step]="options.step"
                   type="number">

            <mat-error *xmControlErrors="control.errors; translates options?.errors; message as message">
                {{message}}
            </mat-error>

            <mat-hint [hint]="options.hint"></mat-hint>
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

    private _options: XmNumberControlOptions = XM_NUMBER_CONTROL_DEFAULT_OPTIONS;

    public get options(): XmNumberControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmNumberControlOptions) {
        this._options = defaults({}, value, {
            ...XM_NUMBER_CONTROL_DEFAULT_OPTIONS,
            errors: this.xmControlErrorsTranslates,
        });
        this._options.placeholder = this._options.placeholder || this._options.title;
    }
}

