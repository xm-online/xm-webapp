import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XM_ANGULAR_EDITOR_CONTROL_ELEMENTS } from '@xm-ngx/components/xm-angular-editor-control.registry';
import { XM_TEXT_CONTROL_ELEMENTS } from './xm-text-control.registry';
import { XM_TEXT_RANGE_ELEMENTS } from './xm-text-range.registry';

export const XM_TEXT_TITLE_ENTRY: XmDynamicEntry = {
    selector: '@xm-ngx/components/text-title',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTitleModule),
};

export const XM_TEXT_TRANSLATE_ENTRY: XmDynamicEntry = {
    selector: '@xm-ngx/components/text-translate',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTranslateModule),
};

export const XM_TEXT_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: '@xm-ngx/components/email-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmEmailControl),
    },
    {
        selector: '@xm-ngx/components/password-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmPasswordControl),
    },
    {
        selector: '@xm-ngx/components/phone-control',
        loadChildren: () => import('@xm-ngx/components/phone-number-control').then(m => m.XmPhoneNumberControlComponent),
    },
    {
        selector: '@xm-ngx/components/text',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/text` instead */
        selector: '@xm-ngx/components/text-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextComponent),
    },
    ...XM_TEXT_CONTROL_ELEMENTS,
    {
        selector: '@xm-ngx/components/text-join',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-join-value` instead */
        selector: '@xm-ngx/components/text-join-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinComponent),
    },
    ...XM_TEXT_RANGE_ELEMENTS,
    XM_TEXT_TITLE_ENTRY,
    XM_TEXT_TRANSLATE_ENTRY,
    {
        selector: '@xm-ngx/components/text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-view` instead */
        selector: '@xm-ngx/components/xm-text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        selector: '@xm-ngx/components/text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextDynamicView),
    },
    {
        selector: '@xm-ngx/components/text-cell',
        loadChildren: () => import('./text/text-cell/text-cell.component').then(m => m.XmTextCellComponent),
    },
    ...XM_ANGULAR_EDITOR_CONTROL_ELEMENTS,
];
