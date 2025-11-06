import { Translate } from '@xm-ngx/translation';

export interface SignPageConfig {
    styles?: {
        minHeight?: string;
        borderRadius?: string;
    },
    marketing?: MarketingConfig;
    footer?: SignPageFooter;
    forms: SignPageFormConfig[];
}

export interface SignPageFormConfig {
    key: string;
    selector: string;
    condition: string;
    primaryButton?: Translate;
    next?: string;
    error?: Translate;
    errorIcon: string;
    title?: Translate;
    extraAction?: ExtraAction,
    header: {
        logo: string;
        title: Translate;
        description: Translate;
        class: string;
        style: string;
    };
    config?: any;
}

export interface ExtraAction {
    selector: string;
    config?: ExtraActionConfig;
    controllers?: unknown[];
}

export interface ExtraActionConfig {
    title?: Translate;
}

export interface SignPageLinkConfig {
    title: Translate;
    url: string;
}

export interface SignPageFooter {
    showLanguageSelector?: true;
    links?: SignPageLinkConfig[];
}

export interface MarketingConfig {
    logo?: {
        text?: string;
        logoUrl?: string;
    },
    color?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    html?: string;
}
