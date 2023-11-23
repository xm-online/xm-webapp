import { XmDynamicEntry } from '@xm-ngx/dynamic';
import { XM_ANGULAR_EDITOR_CONTROL_ELEMENTS } from './xm-angular-editor-control.registry';
import { XM_TEXT_CONTROL_ELEMENTS } from './xm-text-control.registry';
import { XM_TEXT_RANGE_ELEMENTS } from './xm-text-range.registry';

export const XM_TEXT_TITLE_ENTRY: XmDynamicEntry = {
    selector: 'text-title',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTitleModule),
};

export const XM_TEXT_TRANSLATE_ENTRY: XmDynamicEntry = {
    selector: 'text-translate',
    loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextTranslateModule),
};

export const XM_TEXT_ELEMENTS: XmDynamicEntry[] = [
    {
        selector: 'email-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmEmailControl),
    },
    {
        selector: 'password-control',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmPasswordControl),
    },
    {
        selector: 'phone-control',
        loadChildren: () => import('@xm-ngx/components/phone-number-control').then(m => m.XmPhoneNumberControlComponent),
    },
    {
        selector: 'text',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/text` instead */
        selector: 'text-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextComponent),
    },
    {
        selector: 'text-collapse',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextCollapseComponent),
    },
    ...XM_TEXT_CONTROL_ELEMENTS,
    {
        selector: 'text-join',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinComponent),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-join-value` instead */
        selector: 'text-join-value',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextJoinComponent),
    },
    ...XM_TEXT_RANGE_ELEMENTS,
    XM_TEXT_TITLE_ENTRY,
    XM_TEXT_TRANSLATE_ENTRY,
    {
        selector: 'text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        /** @deprecated use `@xm-ngx/components/text-view` instead */
        selector: 'xm-text-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextViewModule),
    },
    {
        selector: 'text-dynamic-view',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextDynamicView),
    },
    {
        selector: 'text-cell',
        loadChildren: () => import('@xm-ngx/components/text').then(m => m.XmTextCellComponent),
    },
    ...XM_ANGULAR_EDITOR_CONTROL_ELEMENTS,
];
