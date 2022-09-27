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
import { XmDashboardDynamicRouteResolverGuard, XmDashboardModule } from '@xm-ngx/dashboard';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLoggerModule } from '@xm-ngx/logger';
import { HttpLoaderFactory, LanguageService, TitleService, XmTranslationModule } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmLoggerWatcherService } from '@xm-ngx/logger';

import { IdleLogoutService } from 'src/app/account/logout/idle-logout.service';
import { XmMainComponent } from 'src/app/layouts';
import { LayoutModule } from 'src/app/layouts/layout.module';
import { XmApplicationConfigService } from 'src/app/shared/spec';
import { XmRoutingModule } from 'src/app/xm-routing.module';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from 'src/app/xm.constants';
import { XM_ELEMENTS } from 'src/registries/xm.registry';
import { XmDynamicRouteModule } from '@xm-ngx/dynamic/route';
import { XmBreadcrumbModule } from '@xm-ngx/components/breadcrumb';
import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmSharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions } from '@angular/material/paginator';

const formFieldOptions: MatFormFieldDefaultOptions = {
    appearance: 'fill',
};

const paginatorOptions: MatPaginatorDefaultOptions = {
    formFieldAppearance: 'standard',
};

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmSharedModule.forRoot(),
        XmCoreModule.forRoot(),
        ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
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
        XmDynamicRouteModule.forRoot({ routeResolverGuard: XmDashboardDynamicRouteResolverGuard }),
        XmDashboardModule.forRoot(),
        MarkdownModule.forRoot(),
        XmBreadcrumbModule.forRoot(),
        NgxMaskModule.forRoot(),
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
                selector: 'ext-common-entity',
                loadChildren: () => import('./ext-commons/ext-common-entity/module/ext-common-entity.module').then(m => m.ExtCommonEntityModule),
            },
            {
                selector: 'ext-ext-common-entity',
                loadChildren: () => import('./ext-commons/ext-common-entity/module/ext-common-entity.module').then(m => m.ExtCommonEntityModule),
            },
            {
                selector: 'boards',
                loadChildren: () => import('./ext/boards-webapp-ext/module/boards-webapp-ext.module').then(m => m.BoardsWebappExtModule),
            },
            {
                selector: 'ext-boards',
                loadChildren: () => import('./ext/boards-webapp-ext/module/boards-webapp-ext.module').then(m => m.BoardsWebappExtModule),
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
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
        { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: paginatorOptions },
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
