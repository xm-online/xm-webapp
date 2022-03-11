import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTextTitleOptions } from '../text-title';
import { DataQa } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { HintText } from '@xm-ngx/components/hint';

export interface XmTextRangeControlOptions extends XmTextTitleOptions, DataQa {
    hint?: HintText;
    placeholder?: Translate;
    required?: boolean;
    id?: string;
    rows?: string | number;
    maxLength?: number;
    autosize?: boolean;
    minRows?: number;
    maxRows?: number;
    style?: { [klass: string]: unknown };
}

const XM_TEXT_RANGE_CONTROL_OPTIONS_DEFAULT: XmTextRangeControlOptions = {
    hint: null,
    title: '',
    placeholder: '',
    id: null,
    required: true,
    maxLength: null,
    dataQa: 'text-range-control',
    autosize: false,
    minRows: null,
    maxRows: null,
};

@Component({
    selector: 'xm-text-range-control',
    template: `
        <mat-form-field>
            <mat-label>{{options.title | translate}}</mat-label>

            <textarea [placeholder]="options.placeholder | translate"
                      [id]="options.id"
                      [required]="options.required"
                      [attr.maxlength]="options.maxLength"
                      [attr.data-qa]="options.dataQa"
                      [rows]="options.rows || 4"
                      [formControl]="control"
                      [cdkTextareaAutosize]="options.autosize"
                      [cdkAutosizeMinRows]="options.minRows"
                      [cdkAutosizeMaxRows]="options.maxRows"
                      [ngStyle]="options.style"
                      matInput>
            </textarea>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>

            <mat-hint *ngIf="options.maxLength" align="end">{{value?.length}} / {{options.maxLength}}</mat-hint>

            <mat-hint [hint]="options.hint"></mat-hint>
        </mat-form-field>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmTextRangeControlComponent extends NgFormAccessor<string> {
    private _options: XmTextRangeControlOptions = clone(XM_TEXT_RANGE_CONTROL_OPTIONS_DEFAULT);

    public get options(): XmTextRangeControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmTextRangeControlOptions) {
        this._options = defaults(value, XM_TEXT_RANGE_CONTROL_OPTIONS_DEFAULT);
    }
}
