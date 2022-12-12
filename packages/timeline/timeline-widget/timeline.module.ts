import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatButtonModule } from '@angular/material/button';

import { TimeAgoService } from '../src/time-ago.service';
import { TimelineService } from '../src/timeline.service';
import { TimelineComponent } from './timeline.component';

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
        TimelineComponent,
    ],
    exports: [
        TimelineComponent,
    ],
    providers: [
        TimeAgoService,
        TimelineService,
    ],
})
export class XmTimelineModule {
}
