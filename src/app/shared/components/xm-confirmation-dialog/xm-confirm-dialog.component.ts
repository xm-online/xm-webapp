import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotImplementedException } from '@xm-ngx/shared/exceptions';


@Component({
    selector: 'xm-confirm-dialog',
    templateUrl: './xm-confirm-dialog.component.html',
})
export class XmConfirmDialogComponent {

    @ViewChild('xmConfirmDialog', {static: false}) public tpl: ElementRef;
    public form: UntypedFormGroup;
    public modal: MatDialogRef<any>;
    public showLoader: boolean;
    public incorrect: boolean;
    public event: any;

    constructor(
        private fb: UntypedFormBuilder,
    ) {
        this.form = this.fb.group({password: [null, Validators.required]});
    }

    public onSubmit(): void {
        throw new NotImplementedException();
    }

    public onDismiss(): void {
        this.modal.close();
    }

}
