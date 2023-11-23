import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TEXT_RANGE_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'text-range-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-range-control` instead */
        selector: 'text-range',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControl),
    },
];
