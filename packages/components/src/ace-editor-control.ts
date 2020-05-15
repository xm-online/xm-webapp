import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { XmTranslationModule } from '@xm-ngx/translation';
import * as _ from 'lodash';
import { AceEditorModule } from '../../../src/app/shared/directives/ace-editor.directive';
import { NgModelWrapper } from './ng-model-wrapper';

interface IAceEditorControlOptions {
    title?: string;
    name?: string;
    mode?: string | 'json';
    height?: string;
}

const DEFAULT_OPTIONS: IAceEditorControlOptions = {
    title: '',
    name: 'text',
    mode: 'json',
    height: '200px',
};

@Component({
    selector: 'xm-ace-editor-control',
    template: `
        <div class="form-group">
            <label class="control-label">{{ _options.title | translate }}</label>
            <div class="ace-editor-control border"
                 [ngClass]="{ 'border-danger': error}"
                 (textChanged)="change($event)"
                 [autoUpdateContent]="true"
                 [mode]="_options.mode"
                 [readOnly]="disabled"
                 [text]="_value"
                 [attr.name]="_options.name"
                 [style.height]="_options.height"
                 xmAceEditor>
            </div>
        </div>
    `,
    // TODO: move to global
    styles: [
            `
            .ace-editor-control {
                width: 100%;
            }
        `,
    ],
    providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => AceEditorControlComponent), multi: true}],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AceEditorControlComponent extends NgModelWrapper<string | object> {
    @Input() public disabled: boolean;

    public error: boolean = false;
    public _options: IAceEditorControlOptions = DEFAULT_OPTIONS;

    public get options(): IAceEditorControlOptions {
        return this._options;
    }

    @Input()
    public set options(value: IAceEditorControlOptions) {
        this._options = _.defaults(value, DEFAULT_OPTIONS);
    }

    public _value: string;

    public get value(): string | object {
        if (this._options.mode === 'json') {
            return JSON.parse(this._value);
        }

        return this._value;
    }

    @Input()
    public set value(value: string | object) {
        if (typeof value === 'object') {
            this._value = JSON.stringify(value, null, 2);
        } else {
            this._value = value;
        }
    }

    public change(v: any): void {
        if (this._options.mode === 'json') {
            try {
                v = JSON.parse(v);
                this.error = false;
            } catch (e) {
                this.error = true;
            }
        }
        this._onChange(v);
        this.valueChange.next(v);
    }

}

@NgModule({
    imports: [
        XmTranslationModule,
        AceEditorModule,
        CommonModule,
    ],
    exports: [AceEditorControlComponent],
    declarations: [AceEditorControlComponent],
    providers: [],
})
export class AceEditorControlModule {
}
