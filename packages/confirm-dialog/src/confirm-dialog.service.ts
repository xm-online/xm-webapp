import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmConfirmDialogComponent } from './confirm-dialog.component';
import { XmConfirmDialogControls, XmConfirmDialogData } from './confirm-dialog.interface';
import { Translate } from '@xm-ngx/translation';

@Injectable({
    providedIn: 'root',
})
export class XmConfirmDialogService {
    private dialogRef: MatDialogRef<any>;

    constructor(
        private matDialog: MatDialog,
    ) {
    }

    public open(title?: Translate, controls?: XmConfirmDialogControls, subtitle?: Translate): MatDialogRef<any> {
        this.dialogRef = this.matDialog.open<XmConfirmDialogComponent, XmConfirmDialogData>(XmConfirmDialogComponent, {
            data: {
                title,
                controls,
                subtitle
            },
        });

        return this.dialogRef;
    }

    public close(): void {
        this.dialogRef?.close(null);
    }
}
