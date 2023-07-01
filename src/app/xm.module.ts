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
import { AuthServerProvider, XmCoreAuthModule } from '@xm-ngx/core/auth';
import { Principal } from '@xm-ngx/core/user';
import { UserRouteAccessService } from '@xm-ngx/core/permission';
import { XmApplicationConfigService, XmCoreConfigModule } from '@xm-ngx/core/config';
import { environment } from '@xm-ngx/core/environment';
import { globalErrorHandlerFactory, XmUpdateService } from '@xm-ngx/core/global-error-handler';
import { themeInitializerFactory } from '@xm-ngx/core/theme';
import { XmDashboardDynamicRouteResolverGuard, XmDashboardModule } from '@xm-ngx/dashboard';
import { XmDynamicExtensionModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { XmLoggerModule, XmLoggerWatcherService } from '@xm-ngx/logger';
import { HttpLoaderFactory, LanguageService, TitleService, XmTranslationModule } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorDefaultOptions } from '@angular/material/paginator';
import { NgxMaskModule } from 'ngx-mask';
import { XM_DATE_ELEMENTS } from 'packages/components/xm-date.registry';
import { XM_HTML_ELEMENTS } from 'packages/components/xm-html.registry';
import { XM_TEXT_ELEMENTS } from 'packages/components/xm-text.registry';
import { XM_BOOL_ELEMENTS } from 'packages/components/xm-bool.registry';
import { XM_COPY_ELEMENTS } from 'packages/components/xm-copy.registry';
import { XM_LINK_ELEMENTS } from 'packages/components/xm-link.registry';
import { XM_ENUM_ELEMENTS } from 'packages/components/xm-enum.registry';
import { XM_ARRAY_ELEMENTS } from 'packages/components/xm-array.registry';
import { XM_TABLE_ELEMENTS } from 'packages/components/xm-table.registry';
import { XM_NAVBAR_ELEMENTS } from 'packages/components/xm-navbar.registry';
import { XM_DASHBOARD_ELEMENTS } from 'packages/dashboard/xm-dashboard.registry';
import { XM_ADMINISTRATION_ELEMENTS } from 'packages/administration/xm-administration.registry';
import { XM_COMPONENTS_ELEMENTS } from 'packages/components/xm.registry';
import { XmDynamicRouteModule } from '@xm-ngx/dynamic/route';
import { XmBreadcrumbModule } from '@xm-ngx/components/breadcrumb';

import { IdleLogoutService } from '@xm-ngx/account/logout/idle-logout.service';
import { XmMainComponent } from 'src/app/layouts';
import { LayoutModule } from 'src/app/layouts/layout.module';
import { XmRoutingModule } from 'src/app/xm-routing.module';
import { XM_MAT_DIALOG_DEFAULT_OPTIONS } from 'src/app/xm.constants';

import { XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES } from '@xm-ngx/components/validator-processing';
import { XmSharedModule } from 'packages/shared/src/shared.module';
import {
    ArrayTypeComponent,
    ConfigComponent,
    MultiSchemaTypeComponent,
    NullTypeComponent,
    ObjectTypeComponent
} from '@xm-ngx/administration/dashboards-config/widget-edit/schema-editor/schema-formly-ext';
import { FormlyModule } from '@ngx-formly/core';

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
        BrowserAnimationsModule,
        XmRoutingModule,
        XmSharedModule.forRoot(),
        XmCoreModule.forRoot(),
        ControlErrorModule.forRoot({ errorTranslates: XM_VALIDATOR_PROCESSING_CONTROL_ERRORS_TRANSLATES }),
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
            // #regionstart dynamic-extension-modules
            // #regionend dynamic-extension-modules
        ]),
        XmDynamicModule.forRoot([].concat(
            XM_DATE_ELEMENTS,
            XM_HTML_ELEMENTS,
            XM_TEXT_ELEMENTS,
            XM_BOOL_ELEMENTS,
            XM_COPY_ELEMENTS,
            XM_LINK_ELEMENTS,
            XM_ENUM_ELEMENTS,
            XM_ARRAY_ELEMENTS,
            XM_TABLE_ELEMENTS,
            XM_NAVBAR_ELEMENTS,
            XM_DASHBOARD_ELEMENTS,
            XM_ADMINISTRATION_ELEMENTS,
            XM_COMPONENTS_ELEMENTS,
        )),
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
        xmUpdateService: XmUpdateService,
        loggerWatcherService: XmLoggerWatcherService,
        authServerProvider: AuthServerProvider,
        principal: Principal,
    ) {
        xmUpdateService.init();
        principal.init();
        authServerProvider.init();
        idleLogoutService.init();
        languageService.init();
        titleService.init();
        loggerWatcherService.init();
    }
}
