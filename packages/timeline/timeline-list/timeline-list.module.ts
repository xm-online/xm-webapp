import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { NgJhipsterModule } from 'ng-jhipster';
import { XmMatCardModule } from '@xm-ngx/entity/xm-mat-card';
import { ButtonSpinnerModule } from '@xm-ngx/components/button-spinner';

import { TimelineCardComponent } from './timeline-card/timeline-card.component';
import { TimelineListComponent } from './timeline-list.component';

@NgModule({
    imports: [
        CommonModule,
        LoaderModule,
        XmTranslationModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
        NgJhipsterModule,
        XmMatCardModule,
        ButtonSpinnerModule,
    ],
    exports: [TimelineListComponent],
    declarations: [
        TimelineListComponent,
        TimelineCardComponent,
    ],
})
export class TimelineListModule {
    public entry: Type<TimelineListComponent> = TimelineListComponent;
}
