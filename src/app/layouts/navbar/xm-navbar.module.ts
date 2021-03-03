import { NgModule } from '@angular/core';
import {
    XmNavbarArrowBackWidgetModule,
    XmNavbarHelpLinkWidgetModule,
    XmNavbarLanguageMenuWidgetModule,
    XmNavbarLogoWidgetModule,
    XmNavbarSearchWidgetModule,
    XmNavbarTitleWidgetModule,
    XmNavbarToggleWidgetModule,
} from '@xm-ngx/components/navbar';
import { NavbarComponent } from './navbar.component';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmNavbarNotificationWidgetModule } from '@xm-ngx/components/xm-notifications';


@NgModule({
    imports: [
        CommonModule,
        XmDynamicModule,
        XmNavbarArrowBackWidgetModule,
        XmNavbarTitleWidgetModule,
        XmNavbarSearchWidgetModule,
        XmNavbarHelpLinkWidgetModule,
        XmNavbarLanguageMenuWidgetModule,
        XmNavbarLogoWidgetModule,
        XmNavbarToggleWidgetModule,
        XmNavbarNotificationWidgetModule,
    ],
    exports: [NavbarComponent],
    declarations: [NavbarComponent],
})
export class XmNavbarModule {
}
