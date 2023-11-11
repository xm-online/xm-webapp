import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
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
            }
        ]),
    ],
})
export class XmNgxEntityModule {
}
