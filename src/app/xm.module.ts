import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { XmAlertModule } from '@xm-ngx/alert';
import { proxyInterceptorFactory } from '@xm-ngx/components/proxy-interceptor';

import { XmCoreModule } from '@xm-ngx/core';
import { AuthServerProvider, Principal, UserRouteAccessService, XmCoreAuthModule } from '@xm-ngx/core/auth';
import { environment } from '@xm-ngx/core/environment';
import { themeInitializerFactory } from '@xm-ngx/core/theme';
import { XmDashboardModule } from '@xm-ngx/dashboard';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { HttpLoaderFactory, LanguageService, TitleService, XmTranslationModule } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { IdleLogoutService } from './account/logout/idle-logout.service';
import { XmMainComponent } from './layouts';
import { LayoutModule } from './layouts/layout.module';
import { XmApplicationConfigService } from './shared/spec';
import { XmRoutingModule } from './xm-routing.module';
import { XM_ELEMENTS } from './xm.registry';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmCoreModule.forRoot(),
        XmCoreAuthModule.forRoot(),
        NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
        TranslateModule.forRoot({
            isolate: false,
            loader: { deps: [HttpClient], provide: TranslateLoader, useFactory: HttpLoaderFactory },
        }),
        XmAlertModule.forRoot(),
        XmTranslationModule.forRoot(),
        XmDashboardModule.forRoot(),
        MarkdownModule.forRoot(),
        XmDynamicModule.forRoot(XM_ELEMENTS),
        LayoutModule,
    ],
    providers: [
        themeInitializerFactory(),
        proxyInterceptorFactory({ url: environment.serverApiUrl, excludedUrls: ['http', 'i18n', 'assets'] }),
        XmApplicationConfigService,
        UserRouteAccessService,
        CookieService,
    ],
    bootstrap: [XmMainComponent],
})
export class XmModule {
    constructor(
        languageService: LanguageService,
        idleLogoutService: IdleLogoutService,
        titleService: TitleService,
        authServerProvider: AuthServerProvider,
        principal: Principal,
    ) {
        principal.init();
        authServerProvider.init();
        idleLogoutService.init();
        languageService.init();
        titleService.init();
    }
}
