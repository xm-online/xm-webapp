import { inject, Injectable } from '@angular/core';
import { CopyPasteDialogDialog } from './copy-paste-dialog.model';
import { Observable } from 'rxjs';
import { CopyPasteDialogComponent } from './copy-paste-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root',
})
export class CopyPasteDialogService {
    private matDialog: MatDialog = inject(MatDialog);

    public getClipboardDialog(dialogData: CopyPasteDialogDialog): Observable<CopyPasteDialogDialog> {
        const dialogForm = this.matDialog.open<CopyPasteDialogComponent>(
            CopyPasteDialogComponent,
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
