import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';

import { XmNavbarNotificationWidget } from './notifications/xm-navbar-notification-widget.component';
import { NotificationsService } from './shared/notifications.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        XmPermissionModule,
        MatIconModule,
        MatMenuModule,
        MatBadgeModule,
        MatButtonModule,
        XmTranslationModule,
    ],
    declarations: [XmNavbarNotificationWidget],
    exports: [XmNavbarNotificationWidget],
    providers: [NotificationsService],
})
export class XmNavbarNotificationWidgetModule {
    public entry: Type<XmNavbarNotificationWidget> = XmNavbarNotificationWidget;
}
