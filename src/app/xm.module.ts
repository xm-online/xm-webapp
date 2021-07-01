import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { XmAlertModule } from '@xm-ngx/alert';
import { ControlErrorModule } from '@xm-ngx/components/control-error';
import { proxyInterceptorFactory } from '@xm-ngx/components/proxy-interceptor';
import { XmCoreModule } from '@xm-ngx/core';
import { AuthServerProvider, Principal, UserRouteAccessService, XmCoreAuthModule } from '@xm-ngx/core/auth';
import { XmCoreConfigModule } from '@xm-ngx/core/config';
import { environment } from '@xm-ngx/core/environment';
import { globalErrorHandlerFactory } from '@xm-ngx/core/global-error-handler';
import { themeInitializerFactory } from '@xm-ngx/core/theme';
import { XmDashboardModule } from '@xm-ngx/dashboard';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLoggerModule } from '@xm-ngx/logger';
import { HttpLoaderFactory, LanguageService, TitleService, XmTranslationModule } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmLoggerWatcherService } from '../../packages/logger/src/xm-logger-watcher.service';

import { IdleLogoutService } from './account/logout/idle-logout.service';
import { XmMainComponent } from './layouts';
import { LayoutModule } from './layouts/layout.module';
import { XmApplicationConfigService } from './shared/spec';
import { XmRoutingModule } from './xm-routing.module';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from './xm.constants';
import { XM_ELEMENTS } from '../registries/xm.registry';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmCoreModule.forRoot(),
        ControlErrorModule.forRoot(),
        XmCoreConfigModule,
        XmCoreAuthModule.forRoot(),
        NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
        TranslateModule.forRoot({
            isolate: false,
            loader: { deps: [HttpClient], provide: TranslateLoader, useFactory: HttpLoaderFactory },
        }),
        XmLoggerModule.forRoot(),
        XmAlertModule.forRoot(),
        XmTranslationModule.forRoot(),
        XmDashboardModule.forRoot(),
        MarkdownModule.forRoot(),
        XmDynamicExtensionModule.forRoot([
// #regionstart dynamic-extension-modules
    {
        selector: 'ext-common',
        loadChildren: () => import('./ext-commons/ext-common/module/ext-common.module').then(m => m.ExtCommonModule),
    },
    {
        selector: 'ext-ext-common',
        loadChildren: () => import('./ext-commons/ext-common/module/ext-common.module').then(m => m.ExtCommonModule),
    },
    {
        selector: 'ext-common-csp',
        loadChildren: () => import('./ext-commons/ext-common-csp/module/ext-common-csp.module').then(m => m.ExtCommonCspModule),
    },
    {
        selector: 'ext-ext-common-csp',
        loadChildren: () => import('./ext-commons/ext-common-csp/module/ext-common-csp.module').then(m => m.ExtCommonCspModule),
    },
    {
        selector: 'ext-common-entity',
        loadChildren: () => import('./ext-commons/ext-common-entity/module/ext-common-entity.module').then(m => m.ExtCommonEntityModule),
    },
    {
        selector: 'ext-ext-common-entity',
        loadChildren: () => import('./ext-commons/ext-common-entity/module/ext-common-entity.module').then(m => m.ExtCommonEntityModule),
    },
    {
        selector: 'b2b',
        loadChildren: () => import('./ext/b2b-webapp-ext/module/b2b-webapp-ext.module').then(m => m.B2bWebappExtModule),
    },
    {
        selector: 'ext-b2b',
        loadChildren: () => import('./ext/b2b-webapp-ext/module/b2b-webapp-ext.module').then(m => m.B2bWebappExtModule),
    },
    {
        selector: 'bs',
        loadChildren: () => import('./ext/bs-webapp-ext/module/bs-webapp-ext.module').then(m => m.BsWebappExtModule),
    },
    {
        selector: 'ext-bs',
        loadChildren: () => import('./ext/bs-webapp-ext/module/bs-webapp-ext.module').then(m => m.BsWebappExtModule),
    },
    {
        selector: 'common',
        loadChildren: () => import('./ext/common-webapp-ext/module/common-webapp-ext.module').then(m => m.CommonWebappExtModule),
    },
    {
        selector: 'ext-common',
        loadChildren: () => import('./ext/common-webapp-ext/module/common-webapp-ext.module').then(m => m.CommonWebappExtModule),
    },
    {
        selector: 'dua',
        loadChildren: () => import('./ext/dua-webapp-ext/module/dua-webapp-ext.module').then(m => m.DuaWebappExtModule),
    },
    {
        selector: 'ext-dua',
        loadChildren: () => import('./ext/dua-webapp-ext/module/dua-webapp-ext.module').then(m => m.DuaWebappExtModule),
    },
    {
        selector: 'entity',
        loadChildren: () => import('./ext/entity-webapp-ext/module/entity-webapp-ext.module').then(m => m.EntityWebappExtModule),
    },
    {
        selector: 'ext-entity',
        loadChildren: () => import('./ext/entity-webapp-ext/module/entity-webapp-ext.module').then(m => m.EntityWebappExtModule),
    },
    {
        selector: 'example',
        loadChildren: () => import('./ext/example-webapp-ext/module/example-webapp-ext.module').then(m => m.ExampleWebappExtModule),
    },
    {
        selector: 'ext-example',
        loadChildren: () => import('./ext/example-webapp-ext/module/example-webapp-ext.module').then(m => m.ExampleWebappExtModule),
    },
    {
        selector: 'neqsol',
        loadChildren: () => import('./ext/neqsol-webapp-ext/module/neqsol-webapp-ext.module').then(m => m.NeqsolWebappExtModule),
    },
    {
        selector: 'ext-neqsol',
        loadChildren: () => import('./ext/neqsol-webapp-ext/module/neqsol-webapp-ext.module').then(m => m.NeqsolWebappExtModule),
    },
    {
        selector: 'vodafone',
        loadChildren: () => import('./ext/vodafone-webapp-ext/module/vodafone-webapp-ext.module').then(m => m.VodafoneWebappExtModule),
    },
    {
        selector: 'ext-vodafone',
        loadChildren: () => import('./ext/vodafone-webapp-ext/module/vodafone-webapp-ext.module').then(m => m.VodafoneWebappExtModule),
    },
// #regionend dynamic-extension-modules
        ]),
        XmDynamicModule.forRoot(XM_ELEMENTS),
        LayoutModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ],
    providers: [
        globalErrorHandlerFactory(),
        themeInitializerFactory(),
        proxyInterceptorFactory({ url: environment.serverApiUrl, excludedUrls: ['http', 'i18n', 'assets'] }),
        XmApplicationConfigService,
        UserRouteAccessService,
        CookieService,
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: XM_MAT_DIALOG_DEFAULT_OPTIONS },
    ],
    bootstrap: [XmMainComponent],
})
export class XmModule {
    constructor(
        languageService: LanguageService,
        idleLogoutService: IdleLogoutService,
        titleService: TitleService,
        loggerWatcherService: XmLoggerWatcherService,
        authServerProvider: AuthServerProvider,
        principal: Principal,
    ) {
        principal.init();
        authServerProvider.init();
        idleLogoutService.init();
        languageService.init();
        titleService.init();
        loggerWatcherService.init();
    }
}
