import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigEditorComponent } from '@xm-ngx/administration/dashboards-config/components/config-editor.component';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'xm-changeable-modal',
    standalone: true,
    imports: [CommonModule, ConfigEditorComponent, FormsModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule],
    templateUrl: './changeable-modal.component.html',
    styleUrl: './changeable-modal.component.scss'
})
export class ChangeableModalComponent implements OnInit {
    public form = new FormGroup({
        classInput: new FormControl(''),
    });
    constructor(public dialogRef: MatDialogRef<ChangeableModalComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    public ngOnInit(): void {
        this.data;
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public save(): void {
        this.dialogRef.close(this.data);
    }

}
