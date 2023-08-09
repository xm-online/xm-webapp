import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as ace from 'brace';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
ace.Range = ace.acequire('ace/range').Range;
import 'brace/theme/chrome';
import 'brace/mode/json';
import AceDiff from 'ace-diff';

@Component({
    selector: 'xm-ace-diff-control',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ace-diff-control.component.html',
    styleUrls: ['./ace-diff-control.component.scss'],
})
export class AceDiffControlComponent implements AfterViewInit {
    private _diffContainer: AceDiff;
    private leftEditor;
    private rightEditor;
    @ViewChild('aceDiffContainer') public container: ElementRef;
    @Input() public config: any;

    private _value: string;

    @Input() set value (value: string) {
        this._value = value;
        this.rightEditor?.setValue(this.formatJson(value), -1);
    }

    private _compareValue: string;
    @Input() set compareValue (value: string) {
        this._compareValue = value;
        this.leftEditor?.setValue(this.formatJson(value), -1);
    }

    public ngAfterViewInit(): void {
        this.initDiff();
    }
    private initDiff(): void{
        this._diffContainer = new AceDiff({
            ace,
            element: this.container.nativeElement,
            diffGranularity: 'specific',
            showDiffs: true,
            showConnectors: true,
            left: {
                content: this.formatJson(this._compareValue),
                editable: false,
                mode: 'ace/mode/json',
                theme: 'ace/theme/chrome',
                copyLinkEnabled: false,
            },
            right: {
                content: this.formatJson(this._value),
                editable: false,
                mode: 'ace/mode/json',
                theme: 'ace/theme/chrome',
                copyLinkEnabled: false,
            },
        });
        this.leftEditor = this._diffContainer.getEditors().left;
        this.rightEditor = this._diffContainer.getEditors().right;
    }

    private formatJson(str: string): string {
        return JSON.stringify(JSON.parse(str || '{}'), null, 2);
    }
}
