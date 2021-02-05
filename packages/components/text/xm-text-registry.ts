import { DynamicComponent } from '@xm-ngx/dynamic';
import { XM_TEXT_CONTROL_ELEMENTS } from './text-control/xm-text-control.registry';
import { XM_TEXT_RANGE_ELEMENTS } from './text-range/xm-text-range.registry';

export const XM_TEXT_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/email-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmEmailControlModule),
    },
    {
        selector: '@xm-ngx/components/password-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmPasswordControlModule),
    },
    {
        selector: '@xm-ngx/components/phone-number-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmPhoneNumberControlModule),
    },
    {
        selector: '@xm-ngx/components/text',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text instead */
        selector: '@xm-ngx/components/text-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextModule),
    },
    ...XM_TEXT_CONTROL_ELEMENTS,
    {
        selector: '@xm-ngx/components/text-join',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text-join-value instead */
        selector: '@xm-ngx/components/text-join-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinModule),
    },
    ...XM_TEXT_RANGE_ELEMENTS,
    {
        selector: '@xm-ngx/components/text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        /** @deprecated use @xm-ngx/components/text-view instead */
        selector: '@xm-ngx/components/xm-text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        selector: '@xm-ngx/components/text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextDynamicViewModule),
    },
];
