import { Component, Input } from '@angular/core';
import { HintText } from '@xm-ngx/components/hint';
import { NgFormAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTextTitleOptions } from '@xm-ngx/components/text';
import { DataQa } from '@xm-ngx/interfaces';
import * as _ from 'lodash';
import { clone, defaults } from 'lodash';

export interface XmFileControlOptions extends XmTextTitleOptions, DataQa {
    hint: HintText;
    multiple: boolean;
    accept: string;
    required: boolean;
}

const XM_FILE_CONTROL_OPTIONS_DEFAULT: XmFileControlOptions = {
    hint: null,
    title: '',
    dataQa: 'file-control',
    multiple: false,
    accept: '*',
    required: false,
};

/**
 * For required you need to use validators
 * @example
 * ```json
 * "validators": [
 *  {
 *    "type": "required"
 *  }
 * ],
 * ```
 */
@Component({
    selector: 'xm-file-control',
    template: `
        <mat-form-field>
            <mat-label>{{ config.title | translate }}</mat-label>

            <input #input
                   (change)="change($event.target.files)"
                   hidden
                   type="file"
                   [attr.accept]="config.accept"/>

            <input #input
                   matInput
                   type="text"
                   [readonly]="true"
                   [value]="fileNames"
                   [formControl]="control"
                   [required]="config.required"
                   [attr.data-qa]="config.dataQa"
                   (click)="input.click()"
                   [attr.multiple]="config.multiple? '' : null"
                   [attr.accept]="config.accept">

            <mat-error *xmControlErrors="control?.errors; message as message">{{ message }}</mat-error>

            <button
                class="me-2"
                matSuffix
                mat-button
                color="primary"
                (click)="input.click()">
                {{ 'ext-entity.image-widget.change-image' | translate }}

                <mat-icon>attach_file</mat-icon>
            </button>

            <mat-hint [hint]="config.hint"></mat-hint>
        </mat-form-field>
    `,
    standalone: false,
})
export class FileControlComponent extends NgFormAccessor<File[]> {
    private _config: XmFileControlOptions = clone(XM_FILE_CONTROL_OPTIONS_DEFAULT);

    public get config(): XmFileControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmFileControlOptions) {
        this._config = defaults(value, XM_FILE_CONTROL_OPTIONS_DEFAULT);
    }

    public get fileNames(): string {
        return this.value ? _.map(this.value, (i => i.name)).join('') : '';
    }

    public change(value: File[]): void {
        this.value = value.length ? value : null;
        this._onChange(value);
        this.valueChange.emit(value);
    }
}
