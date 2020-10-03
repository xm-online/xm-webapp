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
import { XmCoreConfigModule } from '../../packages/core/config';
import { IdleLogoutService } from './account/logout/idle-logout.service';
import { XmMainComponent } from './layouts';
import { LayoutModule } from './layouts/layout.module';
import { XmApplicationConfigService } from './shared/spec';
import { XmRoutingModule } from './xm-routing.module';
import { XM_ELEMENTS } from './xm.registry';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from './xm.constants';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmCoreModule.forRoot(),
        XmCoreConfigModule,
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
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [
        themeInitializerFactory(),
        proxyInterceptorFactory({ url: environment.serverApiUrl, excludedUrls: ['http', 'i18n', 'assets'] }),
        XmApplicationConfigService,
        UserRouteAccessService,
        CookieService,
        {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: XM_MAT_DIALOG_DEFAULT_OPTIONS}
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
