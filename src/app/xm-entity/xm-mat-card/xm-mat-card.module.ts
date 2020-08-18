import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ConditionModule } from '@xm-ngx/components/condition';
import { EditWidgetButtonsModule } from '@xm-ngx/components/edit-buttons';
import { XmTranslationModule } from '@xm-ngx/translation';
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
    ],
})
export class XmMatCardModule {
}
