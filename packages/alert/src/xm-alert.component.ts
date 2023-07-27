import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmAlertConfig } from './xm-alert.interface';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmAlertResult } from './xm-alert-compatibility.interface';
import { XmSafePipe } from '@xm-ngx/pipes';

@Component({
    selector: 'xm-alert-dialog',
    standalone: true,
    imports: [
        CommonModule,
        XmTranslationModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        XmSafePipe,
    ],
    templateUrl: './xm-alert.component.html',
    styleUrls: ['./xm-alert.component.scss'],
})
export class XmAlertComponent {
    constructor(
        public dialogRef: MatDialogRef<XmAlertComponent, XmAlertResult>,
        @Inject(MAT_DIALOG_DATA) public data: XmAlertConfig,
    ) {
    }

    public cancel(): void {
        this.dialogRef.close({ 
            dismiss: 'cancel', 
            isConfirmed: false, 
            isDenied: false,
            isDismissed: true,
        });
    }

    public confirm(): void {
        this.dialogRef.close({ 
            isConfirmed: true, 
            isDenied: false,
            isDismissed: false,
            value: true,
        });
    }

    public close(): void {
        this.dialogRef.close({ 
            dismiss: 'close',
            isConfirmed: false,
            isDenied: false,
            isDismissed: true,
        });
    }
}


