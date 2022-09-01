import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmSharedModule } from '@xm-ngx/shared';

import { TimeAgoService } from './shared/time-ago.service';
import { TimelineService } from './shared/timeline.service';
import { TimelineComponent } from './timeline/timeline.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        LoaderModule,
        XmSharedModule,
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
