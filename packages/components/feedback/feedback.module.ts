import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmCheckboxControl } from '@xm-ngx/components/bool';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { ModalCloseModule } from '@xm-ngx/components/modal-close';
import {
    XmLabeledViewContainerComponent,
    XmTextControl,
    XmTextRangeControl,
} from '@xm-ngx/components/text';
import { XmImageModule } from '@xm-ngx/components/image';
import { XmTranslationModule } from '@xm-ngx/translation';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { FeedbackComponent } from './feedback.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';

@NgModule({
    imports: [
        MatDialogModule,
        MatTooltipModule,
        XmTranslationModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        ModalCloseModule,
        XmTextControl,
        XmImageModule,
        XmLoadingModule,
        XmCheckboxControl,
        XmTextRangeControl,
        XmLabeledViewContainerComponent,
        XmPermissionModule,
    ],
    exports: [FeedbackComponent],
    declarations: [FeedbackComponent, FeedbackDialogComponent],
    providers: [],
})
export class FeedbackModule {
    public entry: Type<FeedbackComponent> = FeedbackComponent;
}
