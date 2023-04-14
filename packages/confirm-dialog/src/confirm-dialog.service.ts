import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { XmConfirmDialogComponent } from './confirm-dialog.component';
import { XmConfirmDialogControls, XmConfirmDialogData } from './confirm-dialog.interface';
import { Translate } from '@xm-ngx/translation';
import { XmConfirmDialogDataService } from './confirm-dialog-data.service';
import { map, Observable, share } from 'rxjs';
import _ from 'lodash';

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

    public open(
        title?: Translate,
        controls?: XmConfirmDialogControls,
        subtitle?: Translate,
        cancelButtonText?: Translate,
        confirmButtonText?: Translate,
        isManualClose?: boolean,
    ): MatDialogRef<XmConfirmDialogComponent> {
        this.dialogData.data = {
            title,
            controls,
            subtitle,
            cancelButtonText,
            confirmButtonText,
            isManualClose,
        };

        this.dialogRef = this.matDialog.open<XmConfirmDialogComponent, XmConfirmDialogData>(XmConfirmDialogComponent);

        return this.dialogRef;
    }

    public change(dialog: XmConfirmDialogData): void {
        if (!this.dialogRef) {
            return;
        }
        
        this.dialogData.data = _.mergeWith({}, this.dialogData.data, dialog, (obj, src) => {
            return _.isArray(src) ? src : undefined;
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
