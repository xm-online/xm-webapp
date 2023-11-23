import { XmDynamicEntry } from '@xm-ngx/dynamic';

export const XM_TEXT_CONTROL_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControl),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-control` instead */
        selector: 'xm-text-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextControl),
    },
    {
        selector: 'text-search-pattern-control',
        loadChildren: () => import('@xm-ngx/components/text-search-pattern').then(m => m.TextSearchPatternControlComponent),
    },
];
