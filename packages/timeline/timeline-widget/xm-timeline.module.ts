import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatButtonModule } from '@angular/material/button';

import { TimeAgoService } from '@xm-ngx/timeline';
import { TimelineService } from '@xm-ngx/timeline';
import { XmTimelineWidgetComponent } from './xm-timeline-widget.component';

@NgModule({
    imports: [
        CommonModule,
        LoaderModule,
        XmTranslationModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        MatButtonModule,
    ],
    declarations: [
        XmTimelineWidgetComponent,
    ],
    exports: [
        XmTimelineWidgetComponent,
    ],
    providers: [
        TimeAgoService,
        TimelineService,
    ],
})
export class XmTimelineModule {
}
