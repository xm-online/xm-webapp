import { DynamicComponent } from '@xm-ngx/dynamic';
import { XM_TEXT_RANGE_ELEMENTS } from './text-range/xm-text-range.registry';
import { XM_TEXT_CONTROL_ELEMENTS } from './text-control/xm-text-control.registry';

export const XM_TEXT_ELEMENTS: DynamicComponent[] = [
    ...XM_TEXT_RANGE_ELEMENTS,
    ...XM_TEXT_CONTROL_ELEMENTS,
    {
        selector: '@xm-ngx/components/text',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text instead */
        selector: '@xm-ngx/components/text-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    {
        selector: '@xm-ngx/components/text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextDynamicViewModule),
    },
    {
        selector: '@xm-ngx/components/text-join',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text-join-value instead */
        selector: '@xm-ngx/components/text-join-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    {
        selector: '@xm-ngx/components/xm-text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
];
