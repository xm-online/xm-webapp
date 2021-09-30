import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmNavbarToggleWidget } from './xm-navbar-toggle-widget.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        MatButtonModule,
        XmPermissionModule,
        CommonModule,
    ],
    exports: [XmNavbarToggleWidget],
    declarations: [XmNavbarToggleWidget],
})
export class XmNavbarToggleWidgetModule {
    public entry: Type<XmNavbarToggleWidget> = XmNavbarToggleWidget;
}
