import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouteChangeAnimationModule } from '@xm-ngx/components/animations';
import { FeedbackModule } from '@xm-ngx/components/feedback';
import { GuestBackgroundModule } from '@xm-ngx/components/guest-background';
import { LanguageModule } from '@xm-ngx/translation';
import { LoaderModule } from '@xm-ngx/components/loader';
import { RouteLoadingDirectiveModule } from '@xm-ngx/components/route-loading';
import { XmPasswordNeededModule } from '@xm-ngx/components/password-needed';
import { XmRibbonComponent } from '@xm-ngx/components/ribbon';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmEntityModule } from '@xm-ngx/entity';
import { XmBalanceModule } from '@xm-ngx/balance';
import { XmMaintenanceViewModule } from '@xm-ngx/components/maintenance';
import { XmSidebarRightModule } from '@xm-ngx/components/sidebar-right';
import { XmSidebarModule } from '@xm-ngx/dashboard/sidebar';
import { XmInputPatternModule } from '@xm-ngx/components/inputPattern';
import { XmTimelineModule } from '@xm-ngx/timeline/timeline-widget';
import { XmFooterComponent } from '@xm-ngx/components/footer';
import { XmMainComponent } from './main/main.component';
import { XmNavbarModule } from '@xm-ngx/administration/navbar';
import { PageRibbonComponent } from '@xm-ngx/components/page-ribbon';
import { JhiAlertErrorComponent } from '@xm-ngx/error-messages';
import { CommonModule } from '@angular/common';
import { XmHeatmapContainerComponent } from '@xm-ngx/components/navbar-heatmap-widget';

@NgModule({
    imports: [
        XmFooterComponent,
        JhiAlertErrorComponent,
        XmPasswordNeededModule,
        LanguageModule,
        LoaderModule,
        XmInputPatternModule,
        XmBalanceModule,
        XmMaintenanceViewModule,
        XmEntityModule,
        XmTimelineModule,
        CommonModule,
        RouterModule,
        XmSidebarModule.forRoot(),
        XmSidebarRightModule,
        XmRibbonComponent,
        XmDynamicModule,
        FeedbackModule,
        XmNavbarModule,
        GuestBackgroundModule,
        RouteLoadingDirectiveModule,
        RouteChangeAnimationModule,
        PageRibbonComponent,
        XmHeatmapContainerComponent,
    ],
    exports: [XmMainComponent],
    declarations: [XmMainComponent],
})
export class LayoutModule {
}
