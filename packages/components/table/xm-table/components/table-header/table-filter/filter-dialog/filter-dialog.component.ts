import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroupLayoutFactoryService, FormGroupLayoutItem } from '@xm-ngx/components/form-layout';

@Component({
    selector: 'xm-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.scss'],
})
export class FilterDialogComponent implements OnInit {
    public config: FormGroupLayoutItem[];
    public group: UntypedFormGroup;
    public value: unknown;

    constructor(public dialogRef: MatDialogRef<FilterDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: {config: FormGroupLayoutItem[], value: unknown},
                private layoutFactoryService: FormGroupLayoutFactoryService) {
        this.config = data.config;
        this.value = data.value;

    }

    public ngOnInit(): void {

        this.initForm();
    }

    public submit(): void {
        this.dialogRef.close(this.group.getRawValue());
    }

    public close(): void {
        this.group.reset( { emitEvent: false });
        this.dialogRef.close(this.group.getRawValue())
    }

    private initForm(): void {
        if (this.config) {
            this.group = this.layoutFactoryService.createForm(this.config);
        }
        if (this.value) {
            this.updateValue();
        }

    }

    private updateValue() {
        if (this.group) {
            this.group.patchValue(this.value || {}, { emitEvent: false });
        }
    }
}
