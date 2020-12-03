import { DynamicComponent } from '@xm-ngx/dynamic';

export { XmTextViewModule } from './xm-text-view';
export { TextValueModule } from './text-value';
export { TextJoinValueModule } from './text-join-value';
export { XmTextDynamicOptions, XmTextDynamicView, XmTextDynamicViewModule } from './xm-text-dynamic-view';


export const XM_TEXT_ELEMENTS: DynamicComponent[] = [
    {
        selector: '@xm-ngx/components/text-value',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.TextValueModule),
    },
    {
        selector: '@xm-ngx/components/text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.XmTextDynamicViewModule),
    },
    {
        selector: '@xm-ngx/components/text-join-value',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.TextJoinValueModule),
    },
    {
        selector: '@xm-ngx/components/xm-text-view',
        loadChildren: () => import('@xm-ngx/components/xm-text-view').then(m => m.XmTextViewModule),
    },
];
