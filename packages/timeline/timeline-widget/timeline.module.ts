import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmTranslationModule } from '@xm-ngx/translation';

import { TimeAgoService } from '../src/time-ago.service';
import { TimelineService } from '../src/timeline.service';
import { TimelineComponent } from './timeline.component';

@NgModule({
    imports: [
        CommonModule,
        LoaderModule,
        XmTranslationModule,
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
