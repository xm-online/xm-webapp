import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NotImplementedException } from '@xm-ngx/exceptions';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'xm-confirmation-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule
    ],
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
