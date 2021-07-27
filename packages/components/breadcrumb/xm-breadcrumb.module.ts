import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmBreadcrumbComponent } from './breadcrumb/xm-breadcrumb.component';
import { XmBreadcrumbStore } from './stores/xm-breadcrumb.store';
import { XmTranslationModule } from '@xm-ngx/translation';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { XmBreadcrumbResolver } from './reolvers/xm-breadcrumb.resolver';
import { XmBreadcrumbDefaultResolver } from './reolvers/xm-breadcrumb-default.resolver';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
    declarations: [
        XmBreadcrumbComponent,
    ],
    exports: [
        XmBreadcrumbComponent,
    ],
    imports: [
        CommonModule,
        XmTranslationModule,
        RouterModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class XmBreadcrumbModule {
    public entry: Type<XmBreadcrumbComponent> = XmBreadcrumbComponent;

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
