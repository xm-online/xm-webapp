import { ModuleWithProviders, NgModule } from '@angular/core';
import { XmBreadcrumbStore } from './stores/xm-breadcrumb.store';
import { XmBreadcrumbResolver } from './reolvers/xm-breadcrumb.resolver';
import { XmBreadcrumbDefaultResolver } from './reolvers/xm-breadcrumb-default.resolver';


@NgModule()
export class XmBreadcrumbModule {
    public static forRoot(): ModuleWithProviders<XmBreadcrumbModule> {
        return {
            ngModule: XmBreadcrumbModule,
            providers: [
                { provide: XmBreadcrumbResolver, useClass: XmBreadcrumbDefaultResolver },
                XmBreadcrumbStore,
            ],
        };
    }
}
