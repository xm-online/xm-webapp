import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatListModule } from '@angular/material/list';
import { HistoryEvent } from '../models/config-history.model';
import {XmAceEditorControl, XmAceEditorControlOptions} from "@xm-ngx/components/ace-editor";

@Component({
    selector: 'xm-config-history-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatSelectModule,
        ModalCloseModule,
        ReactiveFormsModule,
        XmTranslationModule,
        MatListModule,
        XmAceEditorControl,
    ],
    templateUrl: './config-history-modal.component.html',
    styleUrls: ['./config-history-modal.component.scss'],
})
export class ConfigHistoryModalComponent {
    private data = inject(MAT_DIALOG_DATA);

    public activeEvent: HistoryEvent;
    public historyEvents: HistoryEvent[] = this.data;
    public aceEditorOptions: XmAceEditorControlOptions = { title: '', mode: 'json', height: 'calc(100vh - 350px)' };

    public onEventClicked(event: HistoryEvent): void {
        this.activeEvent = event;
    }
}
