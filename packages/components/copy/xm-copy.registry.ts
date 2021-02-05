import { DynamicComponent } from '@xm-ngx/dynamic';

export const XM_COPY_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/copy',
        loadChildren: () => import('@xm-ngx/components/copy').then(m => m.XmCopyIconModule),
    },
];
