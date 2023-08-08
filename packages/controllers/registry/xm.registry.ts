import { XmDynamicEntry } from '@xm-ngx/dynamic';


export const XM_CONTROLLERS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/controllers/edit-state-store',
        loadChildren: () => import('packages/controllers/features/edit-state-store').then(m => m.EditStateStoreService),
    },
    {
        selector: '@xm-ngx/controllers/rest-repository',
        loadChildren: () => import('packages/controllers/features/repository/rest-repository').then(m => m.RestRepositoryService),
    },
    {
        selector: '@xm-ngx/controllers/resource-data',
        loadChildren: () => import('packages/controllers/features/resource-data').then(m => m.ResourceDataService),
    },
];
