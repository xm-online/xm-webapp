import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_ICON_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'icon',
        loadChildren: () => import('@xm-ngx/components/icon').then(m => m.XmIconComponent),
    },
];
