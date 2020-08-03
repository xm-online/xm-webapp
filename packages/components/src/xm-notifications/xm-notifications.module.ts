import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmTranslationModule } from '@xm-ngx/translation';

import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './shared/notifications.service';

@NgModule({
  imports: [
    CommonModule,
    XmPermissionModule,
    XmTranslationModule,
  ],
    declarations: [NotificationsComponent],
    exports: [NotificationsComponent],
    providers: [NotificationsService],
})
export class XmNotificationsModule {
    public entry: Type<NotificationsComponent> = NotificationsComponent;
}
