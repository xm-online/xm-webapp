import { NgModule, Type } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { XmNavbarArrowBackWidget } from './xm-navbar-arrow-back-widget.component';

@NgModule({
    imports: [
        MatIconModule,
        MatButtonModule,
        CommonModule,
    ],
    declarations: [XmNavbarArrowBackWidget],
    exports: [XmNavbarArrowBackWidget],
})
export class XmNavbarArrowBackWidgetModule {
    public entry: Type<XmNavbarArrowBackWidget> = XmNavbarArrowBackWidget;
}
