import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmConfirmDialogComponent } from './confirm-dialog.component';
import { XmConfirmDialogData, XmConfirmDialogOpenProps } from './confirm-dialog.interface';
import { XmConfirmDialogDataService } from './confirm-dialog-data.service';
import { map, Observable, share } from 'rxjs';
import { defaults, isArray, mergeWith } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class XmConfirmDialogService {
    private dialogRef: MatDialogRef<XmConfirmDialogComponent>;

    constructor(
        private dialogData: XmConfirmDialogDataService,
        private matDialog: MatDialog,
    ) {
    }

    public open<R>(props: XmConfirmDialogOpenProps = {}): MatDialogRef<XmConfirmDialogComponent> {
        this.dialogData.data = props.data;

        this.dialogRef = this.matDialog.open<XmConfirmDialogComponent, XmConfirmDialogData, R>(XmConfirmDialogComponent, defaults(
            {},
            (props.dialogConfig ?? {}),
            {
                panelClass: 'xm-alert',
            },
        ));

        return this.dialogRef;
    }

    public change(dialog: XmConfirmDialogData): void {
        if (!this.dialogRef) {
            return;
        }
        
        this.dialogData.data = mergeWith({}, this.dialogData.data, dialog, (obj, src) => {
            return isArray(src) ? src : undefined;
        });
    }

    public manualClosed(): Observable<{ result: unknown, dialogRef: MatDialogRef<XmConfirmDialogComponent> }> {
        return this.dialogData.manualClosed.pipe(
            map((result) => ({ result, dialogRef: this.dialogRef })),
            share(),
        );
    }

    public close(): void {
        this.dialogRef?.close(null);
    }
}
