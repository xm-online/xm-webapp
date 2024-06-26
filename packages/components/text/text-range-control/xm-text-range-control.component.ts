import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTextTitleOptions } from '../text-title';
import { DataQa } from '@xm-ngx/interfaces';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { clone, defaults } from 'lodash';
import { HintModule, HintText } from '@xm-ngx/components/hint';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

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
            <mat-label>{{config.title | translate}}</mat-label>

            <textarea [placeholder]="config.placeholder | translate"
                      [id]="config.id"
                      [required]="config.required"
                      [attr.maxlength]="config.maxLength"
                      [attr.data-qa]="config.dataQa"
                      [rows]="config.rows || 4"
                      [formControl]="control"
                      [cdkTextareaAutosize]="config.autosize"
                      [cdkAutosizeMinRows]="config.minRows"
                      [cdkAutosizeMaxRows]="config.maxRows"
                      [ngStyle]="config.style"
                      matInput>
            </textarea>

            <mat-error *xmControlErrors="control?.errors; message as message">{{message}}</mat-error>

            <mat-hint *ngIf="config.maxLength" align="end" style="min-width: fit-content">{{getValueLength()}} / {{config.maxLength}}</mat-hint>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    imports: [
        MatInputModule,
        XmTranslationModule,
        CommonModule,
        ControlErrorModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        HintModule,
    ],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
/** @beta */
export class XmTextRangeControl extends NgFormAccessor<string> {
    private _config: XmTextRangeControlOptions = clone(XM_TEXT_RANGE_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmTextRangeControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmTextRangeControlOptions) {
        this._config = defaults(value, XM_TEXT_RANGE_CONTROL_OPTIONS_DEFAULT);
    }

    public getValueLength(): number {
        return this.value && typeof this.value === 'string' ? this.value.length : 0;
    }
}
