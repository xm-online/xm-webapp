import { XmTextRangeModule } from '@xm-ngx/components/text';
import { DynamicComponent } from '@xm-ngx/dynamic';

export const XM_TEXT_RANGE_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/text-range',
        loadChildren: () => import('@xm-ngx/components/text').then(m => XmTextRangeModule),
    },
];
