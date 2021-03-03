import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { XmNavbarLogoWidget } from './xm-navbar-logo-widget.component';

@NgModule({
    imports: [
        RouterModule,
        CommonModule
    ],
    exports: [XmNavbarLogoWidget],
    declarations: [XmNavbarLogoWidget],
})
export class XmNavbarLogoWidgetModule {
}
