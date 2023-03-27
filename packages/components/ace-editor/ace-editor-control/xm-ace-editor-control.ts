import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import * as _ from 'lodash';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmAceEditorDirective, XmAceEditorThemeSchemeAdapterModule } from '@xm-ngx/components/ace-editor';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlErrorModule } from '@xm-ngx/components/control-error';

export interface XmAceEditorControlOptions {
    id?: string;
    title?: string;
    name?: string;
    mode: string | 'yaml' | 'json';
    height?: string;
    theme?: string;
    darkTheme?: string;
    options?: {
        highlightActiveLine?: boolean;
        maxLines?: number;
        printMargin?: boolean;
        autoScrollEditorIntoView?: boolean;
    },
}

const XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS: XmAceEditorControlOptions = {
    options: {},
    title: '',
    name: 'text',
    mode: 'json',
    height: '200px',
    theme: 'chrome',
    darkTheme: 'tomorrow_night',
};

type AceEditorValue = string | object;

@Component({
    selector: 'xm-ace-editor-control',
    imports: [
        XmTranslationModule,
        XmAceEditorDirective,
        CommonModule,
        MatFormFieldModule,
        ControlErrorModule,
        XmAceEditorThemeSchemeAdapterModule,
    ],
    standalone: true,
    template: `
        <div class="form-group">
            <label class="control-label" *ngIf="config?.title">{{ config.title | translate }}</label>
            <div class="ace-editor-control w-100 border"
                 [ngClass]="{ 'border-danger': error}"
                 (textChanged)="change($event)"
                 [autoUpdateContent]="true"
                 [mode]="config.mode"
                 [readOnly]="disabled"
                 [text]="_value"
                 [config]="config.options"
                 [attr.id]="config.id"
                 [attr.name]="config.name"
                 [style.height]="config.height"
                 [onLightTheme]="config.theme"
                 [onDarkTheme]="config.darkTheme"
                 xmAceEditorThemeSchemeAdapter
                 xmAceEditor>
            </div>
            <mat-error *xmControlErrors="ngControl?.errors; message as message">{{message}}</mat-error>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmAceEditorControlComponent extends NgControlAccessor<AceEditorValue> {
    public error: boolean = false;
    private _config: XmAceEditorControlOptions = XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS;

    public get config(): XmAceEditorControlOptions {
        return this._config;
    }

    @Input()
    public set config(value: XmAceEditorControlOptions) {
        this._config = _.defaults({}, value, XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS);
    }

    public _value: string;

    public get value(): AceEditorValue {
        if (this._config.mode === 'json') {
            return JSON.parse(this._value);
        }

        return this._value;
    }

    @Input()
    public set value(value: AceEditorValue) {
        if (typeof value === 'object') {
            this._value = JSON.stringify(value, null, 2);
        } else {
            this._value = value;
        }
    }

    public change(v: AceEditorValue): void {
        if (this._config.mode === 'json') {
            try {
                v = JSON.parse(v as string);
                this.error = false;
            } catch (e) {
                this.error = true;
            }
        }
        this._onChange(v);
        this.valueChange.next(v);
    }

}

