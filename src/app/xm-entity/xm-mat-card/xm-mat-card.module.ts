import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConditionModule } from '@xm-ngx/components/condition';
import { EditWidgetButtonsModule } from '@xm-ngx/components/edit-buttons';
import { XmLoadingModule } from '@xm-ngx/components/loading';
import { XmTranslationModule } from '@xm-ngx/translation';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmMatCardComponent } from './xm-mat-card.component';


@NgModule({
    declarations: [XmMatCardComponent],
    exports: [XmMatCardComponent],
    imports: [
        CommonModule,
        MatCardModule,
        ConditionModule,
        EditWidgetButtonsModule,
        MatIconModule,
        MatButtonModule,
        XmTranslationModule,
        XmPermissionModule,
        XmLoadingModule,
    ],
})
export class XmMatCardModule {
}
