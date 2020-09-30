import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { AuthExpiredInterceptor } from './auth-expired.interceptor';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [],
})
export class XmCoreAuthModule {
    public static forRoot(): ModuleWithProviders<XmCoreAuthModule> {
        return {
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthExpiredInterceptor,
                    multi: true,
                    deps: [Injector],
                },
            ],
            ngModule: XmCoreAuthModule,
        };
    }
}
