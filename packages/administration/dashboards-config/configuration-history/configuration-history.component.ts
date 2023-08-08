import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfigHistoryModalComponent } from './config-history-modal/config-history-modal.component';
import { HistoryEvent } from './models/config-history.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'xm-configuration-history',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatTooltipModule, MatIconModule],
    templateUrl: './configuration-history.component.html',
    styleUrls: ['./configuration-history.component.scss'],
})
export class ConfigurationHistoryComponent {
    private dialogService = inject(MatDialog);
    @Input() public historyEvents: Observable<HistoryEvent[]>;

    public onClick(): void {
        this.historyEvents.pipe(take(1)).subscribe((history) => {
            if (!history || !history.length) {
                // TODO handle no history state
                return;
            }
            this.dialogService.open(ConfigHistoryModalComponent, {
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw',
                data: history,
            });
        });
    }
}
