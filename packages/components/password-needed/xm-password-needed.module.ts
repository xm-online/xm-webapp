import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededComponent } from './xm-password-needed.component';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [XmPasswordNeededComponent],
    exports: [XmPasswordNeededComponent],
    imports: [
        LoaderModule,
        CommonModule,
        ModalCloseModule,
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
})
export class XmPasswordNeededModule {
}
