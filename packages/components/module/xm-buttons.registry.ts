import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_BUTTON_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'fab-button',
        loadChildren: () => import('@xm-ngx/components/buttons').then(m => m.FabButtonComponent),
    },
    {
        selector: 'fab-mini-button',
        loadChildren: () => import('@xm-ngx/components/buttons').then(m => m.FabMiniButtonComponent),
    },
];
