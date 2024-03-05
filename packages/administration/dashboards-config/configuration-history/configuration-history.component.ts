import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigHistoryModalComponent } from './config-history-modal/config-history-modal.component';
import { HistoryEvent, HistoryModalConfig, HistoryModalData } from './models/config-history.model';
import { Observable } from 'rxjs';
import { DASHBOARDS_TRANSLATES } from '../const';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogModule } from '@angular/cdk/dialog';
import { XmBetaFeatureDirective } from '@xm-ngx/core/config';
import { takeUntil } from 'rxjs/operators';
import { DashboardsConfigHistoryService } from '../services/dashboards-config-history.service';

@Component({
    selector: 'xm-configuration-history',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule, XmTranslationModule, MatBadgeModule, DialogModule, XmBetaFeatureDirective],
    templateUrl: './configuration-history.component.html',
    styleUrls: ['./configuration-history.component.scss'],
})
export class ConfigurationHistoryComponent {
    public TRS: typeof DASHBOARDS_TRANSLATES = DASHBOARDS_TRANSLATES;

    private dialogService: MatDialog = inject(MatDialog);
    private dashboardsConfigHistoryService: DashboardsConfigHistoryService = inject<DashboardsConfigHistoryService>(DashboardsConfigHistoryService);

    @Input() public historyEvents: Observable<HistoryEvent[]>;
    @Input() public config: HistoryModalConfig;

    public onClick(): void {
        const modal: MatDialogRef<ConfigHistoryModalComponent, HistoryModalData> = this.dialogService.open<ConfigHistoryModalComponent, HistoryModalData>(
            ConfigHistoryModalComponent,
            {
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw',
                data: { events: null, config: this.config },
            },
        );
        modal.afterClosed().subscribe(() => this.dashboardsConfigHistoryService.reset());

        this.historyEvents.pipe(takeUntil(modal.afterClosed())).subscribe(history => {
            if (!history) {
                // TODO handle no history state
                return;
            }
            modal.componentInstance.data.events = history;
        });
    }
}
