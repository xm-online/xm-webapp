import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmUiConfigService } from '@xm-ngx/core';
import { filter, switchMap } from 'rxjs/operators';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { FeedbackService } from './feedback.service';

export interface FeedbackConfig {
    feedback: {
        url: string;
    };
}

@Component({
    selector: 'xm-feedback',
    template: `
        <button *ngIf="config" (click)="create(config.feedback.url)" mat-icon-button>
            <mat-icon>feedback</mat-icon>
        </button>
    `,
})
export class FeedbackComponent {

    public config: FeedbackConfig;

    constructor(protected uiConfigService: XmUiConfigService<FeedbackConfig>,
                protected dialog: MatDialog,
                protected feedbackService: FeedbackService) {
    }

    public create(url?: string): void {
        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().pipe(
            filter((i) => i),
            switchMap(res => this.feedbackService.create(res, url)),
        ).subscribe();
    }
}
