import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmAceEditorDirective } from '../xm-ace-editor.directive';
import { XmAceEditorThemeSchemeAdapterDirective } from '../xm-ace-editor-theme-scheme-adapter.directive';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { parse, stringify } from 'yaml';
import { Defaults } from '@xm-ngx/operators';

/**
 *
 * yaml - string
 * json - string
 * object-to-yaml - object
 * object-to-json - object
 *
 */
export enum XmAceEditorControlOptionsModeType {
    'yaml' = 'yaml',
    'json' = 'json',
    'object-to-yaml' = 'object-to-yaml',
    'object-to-json' = 'object-to-json',
}

export interface XmAceEditorControlOptions {
    id?: string;
    title?: string;
    name?: string;
    mode: string | XmAceEditorControlOptionsModeType;
    height?: string;
    theme?: string;
    darkTheme?: string;
    enableInitialFocus?: boolean;
    options?: {
        highlightActiveLine?: boolean;
        maxLines?: number;
        tabSize?: number;
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
    enableInitialFocus: false,
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
        XmAceEditorThemeSchemeAdapterDirective,
    ],
    standalone: true,
    template: `
        <div class="form-group">
            <label class="control-label" *ngIf="config?.title">{{ config.title | translate }}</label>
            <div class="ace-editor-control w-100 border"
                 [ngClass]="{ 'border-danger': error}"
                 (textChanged)="changeValue($event)"
                 [enableInitialFocus]="config.enableInitialFocus"
                 [autoUpdateContent]="true"
                 [mode]="getMode()"
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
            <mat-error *ngIf="error">{{error}}</mat-error>
            <mat-error *xmControlErrors="ngControl?.errors; message as message">{{message}}</mat-error>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmAceEditorControl extends NgControlAccessor<AceEditorValue> {
    public error: object | null = null;

    @Input() @Defaults(XM_ACE_EDITOR_CONTROL_DEFAULT_OPTIONS)
    public config: XmAceEditorControlOptions;

    public _value: string = '';

    public get value(): AceEditorValue {
        try {
            switch (this.config.mode) {
                case 'object-to-json':
                    return JSON.parse(this._value);
                case 'object-to-yaml':
                    return parse(this._value);
            }
            return this._value;
        } catch (e) {
            this.error = e;
        }

        // Default value to keep parent working.
        return this._value;
    }

    @Input()
    public set value(value: AceEditorValue) {
        try {
            switch (this.config.mode) {
                case 'object-to-yaml':
                    this._value = stringify(value, { blockQuote: 'literal' });
                    return;
                case 'object-to-json':
                    this._value = JSON.stringify(value);
                    return;
            }
            this._value = value as string;
        } catch (e) {
            this.error = e;
        }
    }

    public getMode(): string | null {
        switch (this.config.mode) {
            case 'object-to-yaml':
            case 'yaml':
                return 'yaml';
            case 'object-to-json':
            case 'json':
                return 'json';
        }
        return null;
    }

    public changeValue(value: string): void {
        this._value = value;

        // Trigger error check
        this.error = null;
        if (this.value === undefined || this.error) {
            return;
        }

        this._onChange(this.value);
        this.valueChange.next(this.value);
    }
}
