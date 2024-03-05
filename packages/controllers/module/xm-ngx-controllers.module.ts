import { NgModule } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';

@NgModule({
    imports: [
        XmDynamicModule.forChild([
            {
                selector: 'edit-state-store',
                loadChildren: () => import('@xm-ngx/controllers/features/edit-state-store').then(m => m.EditStateStoreService),
            },
            {
                selector: 'rest-repository',
                loadChildren: () => import('@xm-ngx/controllers/features/repository/rest-repository').then(m => m.RestRepositoryService),
            },
            {
                selector: 'resource-data',
                loadChildren: () => import('@xm-ngx/controllers/features/resource-data').then(m => m.ResourceDataService),
            },
            {
                selector: 'resource-array-data',
                loadChildren: () => import('@xm-ngx/controllers/features/resource-array-data').then(m => m.ResourceArrayDataService),
            },
        ]),
    ],
})
export class XmNgxControllersModule {
}
