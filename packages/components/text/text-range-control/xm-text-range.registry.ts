import { DynamicComponent } from '@xm-ngx/dynamic';

export const XM_TEXT_RANGE_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/text-range-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControlModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text-range-control instead */
        selector: '@xm-ngx/components/text-range',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextRangeControlModule),
    },
];
