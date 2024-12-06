import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import * as ace from 'brace';
import { Editor } from 'brace';

import 'brace';
import 'brace/ext/searchbox';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/yaml';
import 'brace/mode/html';
import 'brace/mode/sql';
import 'brace/theme/chrome';
import 'brace/theme/tomorrow_night';
import _ from 'lodash';
import {
    XmAceEditorControlOptionsConfig,
} from './ace-editor-control/xm-ace-editor-control.model';


@Directive({
    selector: '[xmAceEditor]',
    standalone: true,
})
export class XmAceEditorDirective<O = unknown> implements OnDestroy {

    public _alreadyFocused = false;
    public _highlightActiveLine: boolean = true;
    public _showGutter: boolean = true;
    public editor: Editor;
    public oldText: string;
    @Output() public textChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(elementRef: ElementRef) {
        this.editor = ace.edit(elementRef.nativeElement);
        this.init();
        this.initEvents();
    }

    public _config: O;

    @Input()
    public set config(options: O) {
        this._config = options;
        this.editor.setOptions(options || {});
        this.setSessionConfiguration();
    }

    public get config(): O {
        return this._config;
    }

    public _readOnly: boolean = false;

    @Input()
    public set readOnly(readOnly: boolean) {
        this._readOnly = readOnly;
        this.editor.setReadOnly(readOnly);
    }

    public _theme: string = 'chrome';

    @Input() set theme(theme: string) {
        this._theme = theme;
        this.editor.setTheme(`ace/theme/${theme}`);
    }

    public _mode: string = 'json';

    @Input() set mode(mode: string) {
        this._mode = mode;
        this.editor.getSession().setMode(`ace/mode/${mode}`);
    }

    public _autoUpdateContent: boolean = true;

    @Input() set autoUpdateContent(status: boolean) {
        this._autoUpdateContent = status;
    }

    public _enableInitialFocus: boolean = false;

    @Input() set enableInitialFocus(value: boolean) {
        this._enableInitialFocus = value;
    }

    @Input() set text(text: string) {
        if (!text || text === 'null') {
            text = '';
        }

        if (this._autoUpdateContent === true && !_.isEqual(text, this.editor.getValue())) {
            this.editor.setValue(text);
            this.editor.clearSelection();

            // text updated while typing, so we focus cursor on editor only once
            if (this._enableInitialFocus) {
                this.initialFocusOnEditor();
            }
        }
    }

    @Input() set gotoLine(line: number) {
        if (line) {
            this.editor.resize(true);
            this.editor.scrollToLine(line, true, true, () => undefined);
            this.editor.gotoLine(line, 0, true);
        }
    }

    private setSessionConfiguration(): void {
        const {
            useWrapMode = true,
        } = (this.config || {}) as XmAceEditorControlOptionsConfig;
        useWrapMode && this.editor.getSession().setUseWrapMode(true);
    }

    public initialFocusOnEditor(): void {
        if (!this._alreadyFocused) {
            this.editor.focus();
            this.editor.moveCursorTo(0, 0);

            this._alreadyFocused = true;
        }
    }

    public init(): void {
        this.editor.setOptions(this.config || {});
        this.editor.setTheme(`ace/theme/${this._theme}`);
        this.editor.getSession().setMode(`ace/mode/${this._mode}`);
        this.editor.setHighlightActiveLine(this._highlightActiveLine);
        this.editor.renderer.setShowGutter(this._showGutter);
        this.editor.setReadOnly(this._readOnly);
        this.editor.$blockScrolling = Infinity;
    }

    public initEvents(): void {
        this.editor.on('change', () => this.updateValue());
        this.editor.on('keypress', () => this.updateValue());
        this.editor.on('paste', () => this.updateValue());
    }

    public ngOnDestroy(): void {
        this.editor.destroy();
    }

    private updateValue(): void {
        const newVal = this.editor.getValue();

        if (this.oldText != null) {
            this.textChanged.emit(newVal);
        }

        this.oldText = newVal;
    }

}
