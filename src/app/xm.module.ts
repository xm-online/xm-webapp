import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
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
import { AuthServerProvider } from '@xm-ngx/core/user';
import { XmCoreAuthModule } from '@xm-ngx/core/auth';
import { LoginService } from '@xm-ngx/components/login';
import { Principal } from '@xm-ngx/core/user';
import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { XmApplicationConfigService, XmCoreConfigModule } from '@xm-ngx/core/config';
import { environment } from '@xm-ngx/core/environment';
import { globalErrorHandlerFactory, XmUpdateService } from '@xm-ngx/logger/global-error-handler';
import { themeInitializerFactory } from '@xm-ngx/core/theme';
import { XmDashboardDynamicRouteResolverGuard, XmDashboardModule } from '@xm-ngx/dashboard';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLoggerModule, XmLoggerWatcherService } from '@xm-ngx/logger';
import { LanguageService, TitleService, XmTranslationModule,CompositeLoaderFactory } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions } from '@angular/material/paginator';
import { NgxMaskModule } from 'ngx-mask';

import { XmDynamicRouteModule } from '@xm-ngx/dynamic/route';
import { XmBreadcrumbModule } from '@xm-ngx/components/breadcrumb';

import { IdleLogoutService } from '@xm-ngx/account';
import { XmMainComponent } from 'src/app/layouts';
import { LayoutModule } from 'src/app/layouts/layout.module';
import { XmRoutingModule } from 'src/app/xm-routing.module';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from 'src/app/xm.constants';

import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import {
    ArrayTypeComponent,
    ConfigComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    ObjectTypeComponent
} from '@xm-ngx/administration/dashboards-config';
import { FormlyModule } from '@ngx-formly/core';

import { XmSharedModule } from '@xm-ngx/shared';
import { MaintenanceService } from '@xm-ngx/components/maintenance';
import { XmCoreEntityModule } from '@xm-ngx/core/entity';
import { UserLoginService } from '@xm-ngx/account/user-login-widget';
import { XmJsfExtModule } from './xm-jsf-ext.module';

const formFieldOptions: MatFormFieldDefaultOptions = {
    appearance: 'fill',
};

const paginatorOptions: MatPaginatorDefaultOptions = {
    formFieldAppearance: 'outline',
};

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientJsonpModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmJsfExtModule,
        XmSharedModule.forRoot(),
        XmCoreModule.forRoot({
            SERVER_API_URL: environment.serverApiUrl,
            IDP_CLIENT_KEY: environment.idpClientKey,
            IDP_SERVER_API_URL: environment.idpServerApiUrl,
            IS_PRODUCTION: environment.production,
            VERSION: environment.version,
            RELEASE: environment.release,
        }),
        XmCoreEntityModule.forRoot(),
        ControlErrorModule.forRoot({errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES}),
        XmCoreConfigModule,
        XmCoreAuthModule.forRoot(),
        NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-' }),
        TranslateModule.forRoot({
            isolate: false,
            loader: { deps: [HttpClient], provide: TranslateLoader, useFactory: CompositeLoaderFactory },
        }),
        XmLoggerModule.forRoot(),
        XmAlertModule.forRoot(),
        XmTranslationModule.forRoot(),
        XmDynamicRouteModule.forRoot({ routeResolverGuard: XmDashboardDynamicRouteResolverGuard }),
        XmDashboardModule.forRoot(),
        MarkdownModule.forRoot(),
        XmBreadcrumbModule.forRoot(),
        NgxMaskModule.forRoot(),
        FormlyModule.forRoot({
            types: [
                { name: 'null', component: NullTypeComponent, wrappers: ['form-field'] },
                { name: 'array', component: ArrayTypeComponent },
                { name: 'object', component: ObjectTypeComponent },
                { name: 'multischema', component: MultiSchemaTypeComponent },
                { name: 'config', component: ConfigComponent },
            ],
        }),
        XmDynamicExtensionModule.forRoot([
            {
                selector: 'ext-common',
                loadChildren: () => import('@xm-ngx/common-webapp-ext').then(m => m.ExtCommonModule),
            },
            {
                selector: 'ext-ext-common',
                loadChildren: () => import('@xm-ngx/common-webapp-ext').then(m => m.ExtCommonModule),
            },
            {
                selector: 'ext-common-entity',
                loadChildren: () => import('@xm-ngx/common-entity-webapp-ext').then(m => m.ExtCommonEntityModule),
            },
            {
                selector: 'ext-ext-common-entity',
                loadChildren: () => import('@xm-ngx/common-entity-webapp-ext').then(m => m.ExtCommonEntityModule),
            },
            {
                selector: '@xm-ngx/components',
                loadChildren: () => import('@xm-ngx/components/module').then(m => m.XmNgxComponentsModule),
            },
            {
                selector: '@xm-ngx/controllers',
                loadChildren: () => import('@xm-ngx/controllers/module').then(m => m.XmNgxControllersModule),
            },
            {
                selector: '@xm-ngx/dashboard',
                loadChildren: () => import('@xm-ngx/dashboard/module').then(m => m.XmNgxDashboardModule),
            },
            {
                selector: '@xm-ngx/administration',
                loadChildren: () => import('@xm-ngx/administration/module').then(m => m.XmNgxAdministrationModule),
            },
            {
                selector: '@xm-ngx/entity',
                loadChildren: () => import('@xm-ngx/entity/module').then(m => m.XmNgxEntityModule),
            },
            {
                selector: '@xm-ngx/account',
                loadChildren: () => import('@xm-ngx/account/module').then(m => m.XmNgxAccountModule),
            },
            // #regionstart dynamic-extension-modules
            // #regionend dynamic-extension-modules
        ]),
        XmDynamicModule.forRoot([
            // TODO: update selector to @x-mgx/entity/*
            {
                selector: '@xm-ngx/components/navbar-search-widget',
                loadChildren: () => import('@xm-ngx/entity/search').then(m => m.XmNavbarSearchWidget),
            },
            {
                selector: '@xm-ngx/components/application-table-menu',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableMenuComponent),
            },
            {
                selector: '@xm-ngx/components/application-table-state',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableStateComponent),
            },
            {
                selector: '@xm-ngx/components/application-table-delete-button',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableDeleteButtonComponent),
            },
            {
                selector: '@xm-ngx/components/application-table-actions',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableActionsComponent),
            },
            {
                selector: '@xm-ngx/components/application-table-link',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableLinkComponent),
            },
            {
                selector: '@xm-ngx/components/application-table-repository',
                loadChildren: () => import('@xm-ngx/entity').then(m => m.XmEntityTableRepository),
            },
        ]),
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
        UserLoginService,
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: XM_MAT_DIALOG_DEFAULT_OPTIONS },
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: formFieldOptions },
        { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: paginatorOptions },
    ],
    bootstrap: [XmMainComponent],
})
export class XmModule {
    constructor(
        languageService: LanguageService,
        maintenanceService: MaintenanceService,
        idleLogoutService: IdleLogoutService,
        titleService: TitleService,
        xmUpdateService: XmUpdateService,
        loggerWatcherService: XmLoggerWatcherService,
        authServerProvider: AuthServerProvider,
        loginService: LoginService,
        principal: Principal,
    ) {
        xmUpdateService.init();
        maintenanceService.init();
        principal.init();
        loginService.init();
        authServerProvider.init();
        idleLogoutService.init();
        languageService.init();
        titleService.init();
        loggerWatcherService.init();
    }
}
