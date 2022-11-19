import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'xm-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
    public config: any;
    public group: FormGroup;

    constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                public fb: FormBuilder) {
        this.config = data;
        this.group = this.fb.group({['data.organization.name']: []});
    }

    public ngOnInit(): void {
        console.log(this.config);
    }

    public submit(): void {
        this.dialogRef.close(this.group.value);
    }
}
