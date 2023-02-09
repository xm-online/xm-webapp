import { Component } from '@angular/core';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

@Component({
    selector: 'xm-user-password-widget',
    templateUrl: './xm-user-password-widget.component.html',
})
export class XmUserPasswordWidgetComponent implements XmDynamicWidget {
    public config: unknown;
}
