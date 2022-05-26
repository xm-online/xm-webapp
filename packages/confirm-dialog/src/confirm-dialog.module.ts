import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmConfirmDialogComponent } from './confirm-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';
import { ConditionModule } from '@xm-ngx/components/condition';

@NgModule({
    declarations: [
        XmConfirmDialogComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        XmTranslationModule,
        XmDynamicModule,
        ConditionModule,
    ],
    exports: [XmConfirmDialogComponent],
})
export class XmConfirmDialogModule {}
