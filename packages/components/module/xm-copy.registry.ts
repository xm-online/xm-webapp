import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_COPY_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'copy',
        loadChildren: () => import('@xm-ngx/components/copy').then(m => m.XmCopyIconComponent),
    },
];
