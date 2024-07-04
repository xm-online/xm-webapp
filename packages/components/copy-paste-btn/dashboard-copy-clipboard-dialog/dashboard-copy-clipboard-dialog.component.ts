import { Component, inject, Input } from '@angular/core';
import { XmTranslationModule } from '@xm-ngx/translation';
import { Defaults } from '@xm-ngx/operators';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { dayjs } from '@xm-ngx/operators/src/dayjs-util';
import {
    DEFAULT_CONFIG,
    DialogCopyConfig,
    ClipboardOperations,
    DashboardCopyClipboardDialog
} from './dashboard-copy-clipboard-dialog.model';

@Component({
    selector: 'xm-dashboard-copy-clipboard-dialog',
    templateUrl: './dashboard-copy-clipboard-dialog.component.html',
    styleUrls: ['./dashboard-copy-clipboard-dialog.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        XmTranslationModule,
        MatInputModule,
        FormsModule,
    ],
})
export class DashboardCopyClipboardDialogComponent {
    @Input() @Defaults(DEFAULT_CONFIG) public config: DialogCopyConfig = DEFAULT_CONFIG;

    public content: string | ArrayBuffer;
    public ClipboardOperations = ClipboardOperations;
    public dialogResult: DashboardCopyClipboardDialog;

    public data: DashboardCopyClipboardDialog = inject(MAT_DIALOG_DATA) || {};
    private matDialogRef = inject(MatDialogRef<DialogCopyConfig>);

    public save(): void {
        this.matDialogRef.close({
            ...this.dialogResult,
            value: this.content
        });
    }

    public close(): void {
        this.matDialogRef.close(null);
    }

    public setDialogResult(operation: ClipboardOperations, value?: string): void {
        this.content = value || this.data.value;
        this.dialogResult = {
            operation,
            value: this.content
        };
    }

    public download(): void {
        const a = document.createElement('a');
        const file = new Blob([this.content || this.data.value], {type: 'text/plain'});
        const date = dayjs(new Date()).format(this.config.dateFormat);
        a.href = URL.createObjectURL(file);
        a.download = `dashboard_copy_${date}.txt`;
        a.click();
    }

    public upload(fileList: any): void {
        const file = fileList.target.files[0];
        const fileReader: FileReader = new FileReader();
        fileReader.onloadend = () => {
            this.setDialogResult(ClipboardOperations.PASTE, fileReader.result as string);
        };
        fileReader.readAsText(file);
    }
}
