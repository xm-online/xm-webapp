import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XmTextControl } from '@xm-ngx/components/text';

export const XM_TEXT_CONTROL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-control` instead */
        selector: '@xm-ngx/components/xm-text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControl),
    },
];
