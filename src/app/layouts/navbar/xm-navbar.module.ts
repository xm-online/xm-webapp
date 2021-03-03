import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '@xm-ngx/components/language';
import { XmNavbarArrowBackWidgetModule, XmNavbarTitleModule } from '@xm-ngx/components/navbar';
import { NavbarGuestBackgroundModule } from '@xm-ngx/components/navbar-guest-background/navbar-guest-background.module';
import { XmNotificationsModule } from '@xm-ngx/components/xm-notifications';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { InputModule } from '../../shared/directives/input.module';
import { XmNavbarHelpLink } from './help/xm-navbar-help-link';
import { XmNavbarLanguageMenuComponent } from './language/xm-navbar-language-menu.component';
import { XmNavbarLogoComponent } from './logo/xm-navbar-logo.component';
import { NavbarComponent } from './navbar.component';
import { XmNavbarInputSearchComponent } from './search/xm-navbar-input-search.component';
import { XmNavbarToggleComponent } from './toggle/xm-navbar-toggle.component';


@NgModule({
    imports: [
        MatIconModule,
        MatButtonModule,
        RouterModule,
        CommonModule,
        InputModule,
        XmTranslationModule,
        XmDynamicModule,
        XmNotificationsModule,
        LanguageModule,
        MatMenuModule,
        NavbarGuestBackgroundModule,
        MatInputModule,
        MatTooltipModule,
        XmNavbarArrowBackWidgetModule,
        XmNavbarTitleModule,
    ],
    exports: [NavbarComponent],
    declarations: [
        NavbarComponent,
        XmNavbarHelpLink,
        XmNavbarLanguageMenuComponent,
        XmNavbarInputSearchComponent,
        XmNavbarLogoComponent,
        XmNavbarToggleComponent,
    ],
    providers: [],
})
export class XmNavbarModule {
}
