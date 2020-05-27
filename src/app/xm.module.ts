import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { XmAlertModule } from '@xm-ngx/alert';
import { proxyInterceptorFactory } from '@xm-ngx/components/proxy-interceptor';

import { XmApplicationConfigService, XmCoreModule } from '@xm-ngx/core';
import { UserRouteAccessService } from '@xm-ngx/core/auth';
import { environment } from '@xm-ngx/core/environment';
import { XmDashboardModule, XmDynamicModule } from '@xm-ngx/dynamic';
import { HttpLoaderFactory, XmTranslationModule } from '@xm-ngx/translation';
import { CookieService } from 'ngx-cookie-service';
import { MarkdownModule } from 'ngx-markdown';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { XmMainComponent } from './layouts';
import { LayoutModule } from './layouts/layout.module';
import { XmCoreAuthModule } from './modules/xm-core-auth/src/xm-core-auth.module';
import { XmRoutingModule } from './xm-routing.module';
import { XM_ELEMENTS } from './xm.registry';

export function appInitializerFn(appConfig: XmApplicationConfigService): () => Promise<any> {
    // tslint:disable-next-line
    const r = function (): Promise<void> {
        return appConfig.loadAppConfig();
    };
    return r;
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        XmRoutingModule,
        XmCoreModule.forRoot(),
        XmCoreAuthModule.forRoot(),
        NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-'}),
        TranslateModule.forRoot({
            isolate: false,
            loader: {deps: [HttpClient], provide: TranslateLoader, useFactory: HttpLoaderFactory},
        }),
        XmAlertModule.forRoot(),
        XmTranslationModule.forRoot(),
        XmDashboardModule.forRoot(),
        MarkdownModule.forRoot(),
        XmDynamicModule.forRoot(XM_ELEMENTS),
        LayoutModule,
    ],
    providers: [
        proxyInterceptorFactory({url: environment.serverApiUrl, excludedUrls: ['http', 'i18n', 'assets']}),
        XmApplicationConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [XmApplicationConfigService],
        },
        UserRouteAccessService,
        CookieService,
    ],
    bootstrap: [XmMainComponent],
})
export class XmModule {
}
