import { ITranslate, Translate } from '@xm-ngx/translation';

export interface XmExternalLinkConfig {
    link: Translate;
    title: ITranslate;
    icon?: string;
    colorScheme?: 'primary' | 'accent' | 'warn';
    target?: '_blank' | '_self';
}

export const XM_EXTERNAL_LINK_DEFAULTS: XmExternalLinkConfig = {
    link: null,
    title: null,
    icon: 'open_in_new',
    colorScheme: 'primary',
    target: '_blank',
};
