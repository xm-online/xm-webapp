import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'xm-angular-editor-control',
    templateUrl: './angular-editor-control.component.html',
    imports: [
        CommonModule,
        AngularEditorModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    standalone: true,
})
export class AngularEditorControlComponent implements ControlValueAccessor {
    @Input() public options: never;
    public value: string;
    public disable: boolean;
    public wysiwygConfig: AngularEditorConfig = {
        editable: true,
        showToolbar: true,
        defaultParagraphSeparator: 'p',
        toolbarHiddenButtons: [
            ['fontName'],
            [
                'backgroundColor',
                'insertImage',
                'insertVideo',
            ],
        ],
    };

    public disabledWysiwygConfig: AngularEditorConfig = {
        editable: false,
        showToolbar: false,
    };

    public _onChange: (v: string) => void = () => undefined;

    public _onTouched: (v?: unknown) => void = () => undefined;

    public writeValue(obj: string): void {
        this.value = obj;
    }

    public registerOnChange(fn: (_: string) => void): void {
        this._onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.disable = isDisabled;
    }
}
