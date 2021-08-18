import { DataQa, Primitive } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { ChangeDetectionStrategy, Component, Inject, Input, Optional, Self, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmDynamicControl } from '@xm-ngx/dynamic';
import { FormControl, NgControl, Validators } from '@angular/forms';
import { XM_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/control-error';
import { defaults } from 'lodash';


export interface XmNumbersRangeControlOptions extends DataQa {
    titleFrom: Translate,
    titleTo: Translate,
    placeholderFrom: Translate,
    placeholderTo: Translate,
    patternFrom: string,
    patternTo: string,
    idFrom: string,
    idTo: string,
    nameFrom: string,
    nameTo: string,
    requiredFrom: boolean,
    requiredTo: boolean,
    errorsFrom: {[errorKey: string]: Translate},
    errorsTo: {[errorKey: string]: Translate},
    direction: 'vertical' | 'horizontal',
}

const XM_NUMBER_CONTROL_DEFAULT_OPTIONS: XmNumbersRangeControlOptions = {
    titleFrom: '',
    titleTo: '',
    placeholderFrom: '',
    placeholderTo: '',
    patternFrom: '',
    patternTo: '',
    idFrom: null,
    idTo: null,
    dataQa: 'numbers-range-control',
    nameFrom: 'numbers-range-from',
    nameTo: 'numbers-range-to',
    requiredFrom: false,
    requiredTo: false,
    errorsFrom: null,
    errorsTo: null,
    direction: 'horizontal',
};

@Component({
    selector: 'xm-numbers-range-control',
    template: `
        <div class="d-flex" [class.flex-column]="options.direction === 'vertical'">

            <mat-form-field class="flex-fill">
                <mat-label>{{options.titleFrom | translate}}</mat-label>

                <input matInput
                       [formControl]="controlFrom"
                       [placeholder]="options.placeholderFrom | translate"
                       [name]="options.nameFrom"
                       [id]="options.idFrom"
                       [required]="options.requiredFrom"
                       [pattern]="options.patternFrom"
                       [max]="valueTo"
                       (change)="valueFrom = $event.target.value"
                       type="number">

                <mat-error *xmControlErrors="controlFrom.errors; translates options?.errorsFrom; message as message">
                    {{message}}
                </mat-error>

            </mat-form-field>


            <mat-form-field class="flex-fill">
                <mat-label>{{options.titleTo | translate}}</mat-label>

                <input matInput
                       [formControl]="controlTo"
                       [placeholder]="options.placeholderTo | translate"
                       [name]="options.nameTo"
                       [id]="options.idTo"
                       [required]="options.requiredTo"
                       [pattern]="options.patternTo"
                       [min]="valueFrom"
                       (change)="valueTo = $event.target.value"
                       type="number">

                <mat-error *xmControlErrors="controlTo.errors; translates options?.errorsTo; message as message">
                    {{message}}
                </mat-error>

            </mat-form-field>

        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class NumbersRangeControlComponent extends NgFormAccessor<Primitive> implements XmDynamicControl<Primitive, XmNumbersRangeControlOptions> {
    constructor(@Optional() @Self() public ngControl: NgControl | null,
                @Inject(XM_CONTROL_ERRORS_TRANSLATES) protected xmControlErrorsTranslates: {[errorKey: string]: Translate}) {
        super(ngControl);
    }

    private _valueFrom: number;
    public get valueFrom(): number {
        return this._valueFrom;
    }

    public set valueFrom(value: number) {
        this._valueFrom = value;
        this.controlTo.setValidators([Validators.min(this.valueFrom)]);
    }

    private _valueTo: number;
    public get valueTo(): number {
        return this._valueTo;
    }

    public set valueTo(value: number) {
        this._valueTo = value;
        this.controlFrom.setValidators([Validators.max(this.valueTo)]);
    }

    public controlFrom: FormControl = new FormControl();
    public controlTo: FormControl = new FormControl();

    private _options: XmNumbersRangeControlOptions = XM_NUMBER_CONTROL_DEFAULT_OPTIONS;

    public get options(): XmNumbersRangeControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmNumbersRangeControlOptions) {
        this._options = defaults({}, value, {
            ...XM_NUMBER_CONTROL_DEFAULT_OPTIONS,
            errors: this.xmControlErrorsTranslates,
        });
        this._options.placeholderFrom = this._options.placeholderFrom || this._options.titleFrom;
        this._options.placeholderTo = this._options.placeholderTo || this._options.titleTo;
    }
}
