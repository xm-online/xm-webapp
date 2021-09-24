import { NgModule, Type } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmNavbarToggleWidget } from './xm-navbar-toggle-widget.component';
import { CommonModule } from '@angular/common';
import { XmPermissionModule } from '../../../core/permission';

@NgModule({
    imports: [
        MatButtonModule,
        CommonModule,
        XmPermissionModule,
    ],
    exports: [XmNavbarToggleWidget],
    declarations: [XmNavbarToggleWidget],
})
export class XmNavbarToggleWidgetModule {
    public entry: Type<XmNavbarToggleWidget> = XmNavbarToggleWidget;
}
