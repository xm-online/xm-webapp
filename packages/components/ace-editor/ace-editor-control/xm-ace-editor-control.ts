import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import * as _ from 'lodash';

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
    template: `
        <div class="form-group">
            <label class="control-label">{{ options.title | translate }}</label>
            <div class="ace-editor-control w-100 border"
                 [ngClass]="{ 'border-danger': error}"
                 (textChanged)="change($event)"
                 [autoUpdateContent]="true"
                 [mode]="options.mode"
                 [readOnly]="disabled"
                 [text]="_value"
                 [options]="options.options"
                 [attr.id]="options.id"
                 [attr.name]="options.name"
                 [style.height]="options.height"
                 [onLightTheme]="options.theme"
                 [onDarkTheme]="options.darkTheme"
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
    private _options: XmAceEditorControlOptions = XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS;

    public get options(): XmAceEditorControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmAceEditorControlOptions) {
        this._options = _.defaults({}, value, XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS);
    }

    public _value: string;

    public get value(): AceEditorValue {
        if (this._options.mode === 'json') {
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
        if (this.options.mode === 'json') {
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

