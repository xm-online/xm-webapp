import { Component } from '@angular/core';
import { XmAceEditorControl, XmAceEditorControlOptions } from '@xm-ngx/components/ace-editor';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'xm-config-editor',
    standalone: true,
    imports: [
        XmAceEditorControl,
        FormsModule,
    ],
    template: `
        <xm-ace-editor-control
                [ngModel]="this.value"
                (ngModelChange)="this.change($event)"
                [disabled]="disabled"
                [config]="aceEditorOptions"
                name="editor"
        >
        </xm-ace-editor-control>
    `,
})
export class ConfigEditorComponent extends NgControlAccessor<string> {
    public aceEditorOptions: XmAceEditorControlOptions = {
        mode: 'object-to-yaml',
        title: '',
        options: {
            tabSize: 2,
        },
        height: 'calc(100vh - 170px)'
    };
}
