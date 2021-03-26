import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TdTextEditorComponent } from '@covalent/text-editor';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

declare const $: any;

@Component({
    selector: 'xm-ext-md-editor-widget',
    templateUrl: 'ext-md-editor.component.html',
    styleUrls: ['ext-md-editor.component.scss'],
})

export class ExtMdEditorComponent implements OnInit {
    @Input() public layoutNode: any;
    public controlValue: any;
    public options: any;
    public isEditable: boolean = false;
    public editorOptions: any = {
        autofocus: true,
        status: false,
        promptURLs: true,
        spellChecker: false,
        showIcons: ['code', 'table'],
        previewRender: (plainText, preview) => {
            setTimeout(() => {
                // for correct parsing in any cases we need to wrap plain text to root tag
                if ($($.parseHTML(`<div>${plainText}</div>`)).find('img[onerror]').length > 0) {
                    // this fix need for security issue: https://github.com/sparksuite/simplemde-markdown-editor/issues/721
                    const errorText = 'onerror handler is not supported';
                    preview.innerHTML = errorText;
                    this._textEditor.writeValue(errorText);
                } else {
                    preview.innerHTML = this._textEditor.simpleMDE.markdown(plainText);
                }
            });
        }
    };
    @ViewChild('mdEditor', {static: false}) private _textEditor: TdTextEditorComponent;

    constructor(private jsf: JsonSchemaFormService) {
    }

    get componentText(): string {
        return this.controlValue ? this.controlValue : '';
    }

    public onToggleEditor(): void {
        this.isEditable = !this.isEditable;
    }

    public onSaveMd(): void {
        this.jsf.updateValue(this, this._textEditor.value);
        this.onToggleEditor();
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }
}
