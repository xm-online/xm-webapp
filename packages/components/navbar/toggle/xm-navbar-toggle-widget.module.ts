import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmNavbarToggleWidget } from './xm-navbar-toggle-widget.component';
import { XmPermissionModule } from '@xm-ngx/core/permission';

@NgModule({
    imports: [
        MatButtonModule,
        XmPermissionModule,
    ],
    exports: [XmNavbarToggleWidget],
    declarations: [XmNavbarToggleWidget],
})
export class XmNavbarToggleWidgetModule {
    public entry: Type<XmNavbarToggleWidget> = XmNavbarToggleWidget;
}
