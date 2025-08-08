import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthInterceptor } from './auth.interceptor';
import { XmAuthenticationStoreService } from './xm-authentication-store.service';
import { XmAuthenticationConfig } from './xm-authentication-config.service';
import { XmAuthTargetUrlService } from './xm-auth-target-url.service';

@NgModule()
export class XmCoreAuthModule {
    public static forRoot(): ModuleWithProviders<XmCoreAuthModule> {
        return {
            providers: [
                XmAuthenticationConfig,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthInterceptor,
                    multi: true,
                    deps: [Injector],
                },
                AuthRefreshTokenService,
                XmAuthTargetUrlService,
                XmAuthenticationStoreService,
            ],
            ngModule: XmCoreAuthModule,
        };
    }
}
