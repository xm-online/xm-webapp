import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmToasterService } from "@xm-ngx/toaster";
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
        <button *ngIf="config?.feedback?.url"
                (click)="create(config.feedback.url)"
                [matTooltip]="'dashboard-config-widget.feedback.tooltip' | translate"
                mat-icon-button>
            <mat-icon>feedback</mat-icon>
        </button>
    `,
})
export class FeedbackComponent {

    public config: FeedbackConfig;

    constructor(
        protected dialog: MatDialog,
        protected feedbackService: FeedbackService,
        private toasterService: XmToasterService
    ) {
    }

    public create(url?: string): void {
        const dialogRef = this.dialog.open(FeedbackDialogComponent, {
            width: '500px',
        });

        dialogRef.afterClosed().pipe(
            filter((i) => i),
            switchMap(res => this.feedbackService.create(res, url)),
        ).subscribe(
            () => this.toasterService.create({
                type: 'success',
                text: 'dashboard-config-widget.feedback.success'
            }).subscribe(),
            () => this.toasterService.create({
                type: 'info',
                text: 'dashboard-config-widget.feedback.error'
            }).subscribe());
    }
}
