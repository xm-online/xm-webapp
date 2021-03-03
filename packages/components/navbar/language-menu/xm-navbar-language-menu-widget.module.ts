import { NgModule } from '@angular/core';
import { XmNavbarLanguageMenuWidget } from './xm-navbar-language-menu-widget.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmTranslationModule } from '@xm-ngx/translation';
import { LanguageModule } from '@xm-ngx/components/language';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        XmTranslationModule,
        LanguageModule,
        MatMenuModule
    ],
    exports: [XmNavbarLanguageMenuWidget],
    declarations: [XmNavbarLanguageMenuWidget],
})
export class XmNavbarLanguageMenuWidgetModule {
}
