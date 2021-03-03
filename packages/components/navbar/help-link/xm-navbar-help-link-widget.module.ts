import { NgModule } from '@angular/core';
import { XmNavbarHelpLinkWidget } from './xm-navbar-help-link-widget.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { XmTranslationModule } from '@xm-ngx/translation';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        XmTranslationModule
    ],
    exports: [XmNavbarHelpLinkWidget],
    declarations: [XmNavbarHelpLinkWidget],
})
export class XmNavbarHelpLinkWidgetModule {
}
