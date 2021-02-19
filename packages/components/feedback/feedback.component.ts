import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@xm-ngx/core/environment';
import { XmToasterService } from '@xm-ngx/toaster';
import html2canvas from 'html2canvas';
import { Observable } from 'rxjs/Observable';
import { filter, finalize, switchMap } from 'rxjs/operators';

import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { FeedbackService, IFeedbackRequest } from './feedback.service';

export function screenshot(): Observable<string> {
    return new Observable((subject) => {
        html2canvas(document.body).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            subject.next(imgData);
            subject.complete();
        });
    });
}

export interface FeedbackConfig {
    feedback: {
        url: string;
    };
}

@Component({
    selector: 'xm-feedback',
    template: `
        <button *ngIf="config?.feedback?.url"
                [xm-loading]="loading"
                [disabled]="loading"
                (click)="create(config.feedback.url)"
                [matTooltip]="'dashboard-config-widget.feedback.tooltip' | translate"
                mat-icon-button>
            <mat-icon>feedback</mat-icon>
        </button>
    `,
})
export class FeedbackComponent {

    public config: FeedbackConfig;
    public loading: boolean = false;

    constructor(
        protected dialog: MatDialog,
        protected feedbackService: FeedbackService,
        private toasterService: XmToasterService,
    ) {
    }

    public create(url?: string): void {
        this.loading = true;
        this.createScreenshot().pipe(
            switchMap((image) => {
                const data: IFeedbackRequest = {
                    topic: '',
                    message: '',
                    image,
                    version: environment.release,
                };

                const dialogRef = this.dialog.open(FeedbackDialogComponent, {
                    width: '500px',
                    data,
                });

                return dialogRef.afterClosed();
            }),
            filter((i) => Boolean(i)),
            switchMap(res => this.feedbackService.create(res, url)),
            finalize(() => {
                this.loading = false;
            }),
        ).subscribe(
            () => this.toasterService.create({
                type: 'success',
                text: 'dashboard-config-widget.feedback.success',
            }).subscribe(),
            () => this.toasterService.create({
                type: 'info',
                text: 'dashboard-config-widget.feedback.error',
            }).subscribe());
    }

    public createScreenshot(): Observable<string> {
        return screenshot();
    }

}
