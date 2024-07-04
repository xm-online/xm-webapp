import { inject, Injectable } from '@angular/core';
import { DashboardCopyClipboardDialog } from '@xm-ngx/components/copy-paste-directive/dashboard-copy-clipboard-dialog/dashboard-copy-clipboard-dialog.model';
import { Observable } from 'rxjs';
import { DashboardCopyClipboardDialogComponent } from '@xm-ngx/components/copy-paste-directive/dashboard-copy-clipboard-dialog/dashboard-copy-clipboard-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class CopyPasteService {
    private matDialog: MatDialog = inject(MatDialog);

    public getClipboardDialog(dialogData: DashboardCopyClipboardDialog): Observable<DashboardCopyClipboardDialog> {
        const dialogForm = this.matDialog.open<DashboardCopyClipboardDialogComponent>(
            DashboardCopyClipboardDialogComponent,
            {
                width: '1000px',
                data: {
                    value: dialogData.value,
                    operation: dialogData.operation
                }
            },
        );
        return dialogForm.afterClosed();
    }
}
