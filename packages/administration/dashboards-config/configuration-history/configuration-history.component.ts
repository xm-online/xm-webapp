import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfigHistoryModalComponent } from './config-history-modal/config-history-modal.component';
import { HistoryEvent, HistoryModalConfig, HistoryModalData } from './models/config-history.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DASHBOARDS_TRANSLATES } from '../const';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogModule } from '@angular/cdk/dialog';
import { XmBetaFeatureDirective } from '@xm-ngx/core/config';

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
    @Input() public historyEvents: Observable<HistoryEvent[]>;
    @Input() public config: HistoryModalConfig;

    public onClick(): void {
        this.historyEvents.pipe(take(1)).subscribe(history => {
            if (!history) {
                // TODO handle no history state
                return;
            }
            this.dialogService.open<ConfigHistoryModalComponent, HistoryModalData>(ConfigHistoryModalComponent, {
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw',
                data: {events: history, config: this.config},
            });
        });
    }
}
