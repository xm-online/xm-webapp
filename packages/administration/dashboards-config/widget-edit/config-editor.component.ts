import {Component} from '@angular/core';
import {XmAceEditorControl, XmAceEditorControlModeEnum, XmAceEditorControlOptions} from '@xm-ngx/components/ace-editor';
import {NgControlAccessor} from '@xm-ngx/components/ng-accessor';
import {FormsModule} from '@angular/forms';
import {XmAceEditorControlTypeEnum} from '@xm-ngx/components/ace-editor/ace-editor-control/xm-ace-editor-control.model';

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
    public aceEditorOptions: Partial<XmAceEditorControlOptions> = {
        mode: XmAceEditorControlModeEnum.JSON,
        type: XmAceEditorControlTypeEnum.OBJECT,
        title: '',
        options: {
            tabSize: 2,
        },
        height: 'calc(100vh - 170px)',
    };
}
