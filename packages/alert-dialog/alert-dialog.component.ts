import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
    title: string;
    subTitle?: string;
    text: string;
    html?: string;
    icon?: string;
    iconColor?: string;
    centered?: boolean;
    showCloseButton?: boolean;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
    buttonsStyling?: string;
    customClass: {
        confirmButton: string,
        cancelButton: string,
    },
    image?: {
        imageUrl: string
        imageWidth?: number | string
        imageHeight?: number | string
        imageAlt?: string
    }
}

@Component({
    selector: 'xm-alert-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './alert-dialog.component.html',
    styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AlertDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
    }

    public onNoClick(): void {
        this.dialogRef.close({dismiss: 'cancel', isConfirmed: false, isDenied: false, isDismissed: true});
    }

    public onYesClick(): void {
        this.dialogRef.close({isConfirmed: true, isDenied: false, isDismissed: false, value: true});
    }

    public onCloseClick(): void {
        this.dialogRef.close({isConfirmed: false, isDenied: false, isDismissed: true, dismiss: 'close'});
    }
}


