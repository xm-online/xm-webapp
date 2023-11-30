import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatListModule } from '@angular/material/list';
import { HistoryEvent } from '../models/config-history.model';
import { AceDiffControlComponent, XmAceEditorControl, XmAceEditorControlModeEnum, XmAceEditorControlOptions, XmAceEditorControlTypeEnum } from '@xm-ngx/components/ace-editor';
import { XmDateTimePipe } from '@xm-ngx/translation/pipes';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';

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
        AceDiffControlComponent,
        XmDateTimePipe,
        MatCardModule,
        XmDateTimePipe,
        MatBadgeModule,
        XmTranslationModule,
    ],
    templateUrl: './config-history-modal.component.html',
    styleUrls: ['./config-history-modal.component.scss'],
})
export class ConfigHistoryModalComponent implements OnInit {
    private data = inject(MAT_DIALOG_DATA);
    public prevConfig: string;
    public prevDate: Date;
    public historyEvents: HistoryEvent[] = this.data;
    public activeEvent: HistoryEvent;

    public aceEditorOptions: XmAceEditorControlOptions = {
        title: '',
        mode: XmAceEditorControlModeEnum.JSON,
        height: 'calc(100vh - 350px)',
        type: XmAceEditorControlTypeEnum.OBJECT,
    };

    public ngOnInit(): void {
        setTimeout(() => {
            this.setPrevValues(0);
            this.activeEvent = this.data?.[0];
        }, 150);
    }

    public onEventClicked(event: HistoryEvent, eventIndex: number): void {
        this.setPrevValues(eventIndex);
        this.activeEvent = event;
    }

    public isCurrent(event: HistoryEvent): boolean {
        return event === this.historyEvents[0];
    }

    private setPrevValues(index: number): void {
        const prevEvent = this.historyEvents[index + 1];
        this.prevConfig = prevEvent?.config ?? '{}';
        this.prevDate = prevEvent?.date ?? null;
    }
}
