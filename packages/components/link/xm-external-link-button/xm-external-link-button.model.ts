import { ITranslate, Translate } from '@xm-ngx/translation';
import { DataQa } from '@xm-ngx/interfaces';

export interface XmExternalLinkConfig extends DataQa {
    link: Translate;
    title: ITranslate;
    icon?: string;
    colorScheme?: 'primary' | 'accent' | 'warn';
    target?: '_blank' | '_self';
    dataQa?: string;
}

export const XM_EXTERNAL_LINK_DEFAULTS: XmExternalLinkConfig = {
    link: null,
    title: null,
    icon: 'open_in_new',
    colorScheme: 'primary',
    target: '_blank',
    dataQa: 'xm-external-link-button',
};
