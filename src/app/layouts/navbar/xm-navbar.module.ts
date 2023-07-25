import { NgModule } from '@angular/core';
import {
    XmNavbarArrowBackWidget,
    XmNavbarHelpLinkWidget,
    XmNavbarLogoWidget,
    XmNavbarTitleWidget,
    XmNavbarToggleWidget,
} from '@xm-ngx/components/navbar';
import { NavbarComponent } from './navbar.component';
import { XmNavbarLanguageMenuWidget } from '@xm-ngx/administration/language-menu';
import { XmNavbarSearchWidget } from '@xm-ngx/entity/search';
import { CommonModule } from '@angular/common';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmNavbarNotificationWidget } from '@xm-ngx/components/navbar-notification-widget';


@NgModule({
    imports: [
        CommonModule,
        XmDynamicModule,
        XmNavbarArrowBackWidget,
        XmNavbarTitleWidget,
        XmNavbarSearchWidget,
        XmNavbarHelpLinkWidget,
        XmNavbarLanguageMenuWidget,
        XmNavbarLogoWidget,
        XmNavbarToggleWidget,
        XmNavbarNotificationWidget,
    ],
    exports: [NavbarComponent],
    declarations: [NavbarComponent],
})
export class XmNavbarModule {
}
