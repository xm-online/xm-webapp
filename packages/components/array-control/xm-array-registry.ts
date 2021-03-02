import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ARRAY_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/array-control',
        loadChildren: () => import('@xm-ngx/components/array-control').then(m => m.XmArrayControlModule),
    },
];
