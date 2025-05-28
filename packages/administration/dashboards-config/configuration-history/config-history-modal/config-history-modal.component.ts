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
import { HistoryEvent, HistoryModalData } from '../models/config-history.model';
import { AceDiffControlComponent, XmAceEditorControlModeEnum, XmAceEditorControlOptions, XmAceEditorControlTypeEnum } from '@xm-ngx/components/ace-editor';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { XmDateComponent } from '@xm-ngx/components/date';
import { DashboardsConfigHistoryService } from '../../services/dashboards-config-history.service';

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
        MatCardModule,
        MatBadgeModule,
        XmDateComponent,
        AceDiffControlComponent,
    ],
    templateUrl: './config-history-modal.component.html',
    styleUrls: ['./config-history-modal.component.scss'],
})
export class ConfigHistoryModalComponent implements OnInit {
    public data: HistoryModalData = inject<HistoryModalData>(MAT_DIALOG_DATA);
    public prevConfig: string;
    public prevDate: Date;
    public activeEvent: HistoryEvent;
    private dashboardsConfigHistoryService: DashboardsConfigHistoryService = inject<DashboardsConfigHistoryService>(DashboardsConfigHistoryService);

    public aceEditorOptions: XmAceEditorControlOptions = {
        title: '',
        mode: XmAceEditorControlModeEnum.JSON,
        type: XmAceEditorControlTypeEnum.STRING,
    };

    public ngOnInit(): void {
        setTimeout(() => {
            this.setPrevValues(0);
            this.activeEvent = this.data?.events?.[0];
        }, 500);
    }

    public onEventClicked(event: HistoryEvent, eventIndex: number): void {
        this.setPrevValues(eventIndex);
        this.activeEvent = event;
    }

    public isCurrent(event: HistoryEvent): boolean {
        return event.date === this.data?.events?.[0]?.date;
    }

    private setPrevValues(index: number): void {
        const prevEvent = this.data?.events?.[index + 1];
        this.prevConfig = prevEvent?.config ?? '{}';
        this.prevDate = prevEvent?.date ?? null;
    }
    public loadMore(): void {
        switch(this.data?.config.itemType) {
            case 'dashboard':
                this.dashboardsConfigHistoryService.nextDashboardPage();
                break;
            case 'widget':
                this.dashboardsConfigHistoryService.nexWidgetPage();
                break;
        }
    }
}
