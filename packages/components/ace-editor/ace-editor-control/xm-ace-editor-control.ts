import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import * as _ from 'lodash';

export interface XmAceEditorControlOptions {
    id?: string;
    title?: string;
    name?: string;
    mode?: string | 'json';
    height?: string;
    theme?: string;
    darkTheme?: string;
}

const XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS: XmAceEditorControlOptions = {
    title: '',
    name: 'text',
    mode: 'json',
    height: '200px',
    theme: 'chrome',
    darkTheme: 'tomorrow_night',
};

@Component({
    selector: 'xm-ace-editor-control',
    template: `
        <div class="form-group">
            <label class="control-label">{{ _options.title | translate }}</label>
            <div class="ace-editor-control w-100 border"
                 [ngClass]="{ 'border-danger': error}"
                 (textChanged)="change($event)"
                 [autoUpdateContent]="true"
                 [mode]="_options.mode"
                 [readOnly]="disabled"
                 [text]="_value"
                 [attr.id]="_options.id"
                 [attr.name]="_options.name"
                 [style.height]="_options.height"
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
export class XmAceEditorControlComponent extends NgControlAccessor<unknown> {
    public error: boolean = false;
    public _options: XmAceEditorControlOptions = XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS;

    public get options(): XmAceEditorControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: XmAceEditorControlOptions) {
        this._options = _.defaults({}, value, XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS);
    }

    public _value: unknown;

    public get value(): unknown {
        if (this._options.mode === 'json') {
            return JSON.parse(this._value as string);
        }

        return this._value;
    }

    @Input()
    public set value(value: unknown) {
        if (typeof value === 'object') {
            this._value = JSON.stringify(value, null, 2);
        } else {
            this._value = value;
        }
    }

    public change(v: unknown): void {
        if (this._options.mode === 'json') {
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

