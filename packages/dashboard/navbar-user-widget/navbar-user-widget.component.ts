import { Component } from '@angular/core';
import { SidebarUserComponent, SidebarUserSubtitle, UserWidgetBase } from '@xm-ngx/dashboard/sidebar-user';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { MenuComponent } from '@xm-ngx/dashboard/menu';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { XmTranslationModule } from '@xm-ngx/translation';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'xm-navbar-user-widget',
    templateUrl: './navbar-user-widget.component.html',
    styleUrls: ['./navbar-user-widget.component.scss'],
    imports: [
        CommonModule,
        XmPermissionModule,
        SidebarUserComponent,
        MenuComponent,
        MatMenuModule,
        MatIconModule,
        RouterModule,
        XmTranslationModule,
        MatDividerModule,
        SidebarUserSubtitle,
    ],
    standalone: true,
})
export class NavbarUserWidgetComponent extends UserWidgetBase {
}
