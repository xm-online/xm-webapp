import { Component } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';
import { CommonModule } from '@angular/common';
import { PasswordModule } from '@xm-ngx/account';
import { XmPermissionModule } from '@xm-ngx/core/permission';

@Component({
    selector: 'xm-user-password-widget',
    templateUrl: './xm-user-password-widget.component.html',
    standalone: true,
    imports: [CommonModule, PasswordModule, XmPermissionModule],
})
export class XmUserPasswordWidgetComponent implements XmDynamicWidget {
    public config: unknown;
}
