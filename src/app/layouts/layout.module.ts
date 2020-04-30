import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '@xm-ngx/components/language';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededModule } from '@xm-ngx/components/xm-password-needed';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmEntityModule } from '@xm-ngx/entity';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmBalanceModule } from '@xm-ngx/xm-balance';
import { XmRibbonModule } from '../modules/xm-ribbon/xm-ribbon.module';
import { XmSidebarModule } from '../modules/xm-sidebar';
import { XmSidebarRightModule } from '../modules/xm-sidebar-right';
import { XmMaintenanceViewModule } from '../shared/components/maintenance/xm-maintenance-view.module';
import { InputModule } from '../shared/directives/input.module';
import { XmNotificationsModule } from '@xm-ngx/components/xm-notifications';
import { XmTimelineModule } from '../xm-timeline/xm-timeline.module';
import { FooterComponent } from './footer/footer.component';
import { XmMainComponent } from './main/main.component';
import { FeedbackDialogComponent } from './navbar/feedback/feedback-dialog/feedback-dialog.component';
import { FeedbackComponent } from './navbar/feedback/feedback.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageRibbonComponent } from './profiles/page-ribbon.component';

@NgModule({
    imports: [
        XmPasswordNeededModule,
        LanguageModule,
        LoaderModule,
        InputModule,
        XmBalanceModule,
        XmMaintenanceViewModule,
        XmEntityModule,
        XmTimelineModule,
        XmNotificationsModule,
        RouterModule,
        XmSidebarModule,
        XmSidebarRightModule,
        XmRibbonModule,
        XmSharedModule,
        XmDynamicModule,
    ],
    exports: [XmMainComponent],
    declarations: [
        XmMainComponent,
        NavbarComponent,
        PageRibbonComponent,
        FooterComponent,
        FeedbackComponent,
        FeedbackDialogComponent,
    ],
    providers: [],
})
export class LayoutModule {
}
