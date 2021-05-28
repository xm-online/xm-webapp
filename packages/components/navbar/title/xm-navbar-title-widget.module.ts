import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmNavbarTitleWidget } from './xm-navbar-title-widget.component';

@NgModule({
    exports: [XmNavbarTitleWidget],
    declarations: [XmNavbarTitleWidget],
    imports: [
        CommonModule,
    ],
})
export class XmNavbarTitleWidgetModule {
    public entry: Type<XmNavbarTitleWidget> = XmNavbarTitleWidget;
}
