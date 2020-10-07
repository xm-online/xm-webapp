import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { XmMenuModule } from '@xm-ngx/components/menu';
import { SidebarUserSubtitle } from '@xm-ngx/components/sidebar-user/sidebar-user-subtitle';
import { SidebarUserComponent } from '@xm-ngx/components/sidebar-user/sidebar-user.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';

@NgModule({
    imports: [
        CommonModule,
        XmMenuModule,
        XmPermissionModule,
        XmTranslationModule,
        XmDynamicModule,
    ],
    exports: [SidebarUserComponent],
    declarations: [SidebarUserComponent, SidebarUserSubtitle],
})
export class XmSidebarUserModule {
    public entry: Type<SidebarUserComponent> = SidebarUserComponent;
}
