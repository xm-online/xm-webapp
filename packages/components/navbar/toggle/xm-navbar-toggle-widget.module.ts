import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { XmNavbarToggleWidget } from './xm-navbar-toggle-widget.component';

@NgModule({
    imports: [
        MatButtonModule
    ],
    exports: [XmNavbarToggleWidget],
    declarations: [XmNavbarToggleWidget],
})
export class XmNavbarToggleWidgetModule {
}
