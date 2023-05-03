import { Translate } from '@xm-ngx/translation';

export interface SignPageConfig {
    styles?:{
        minHeight?: string,
        borderRadius?: string,
    },
    marketing?: MarketingConfig,
    footer?: {
        showLanguageSelector?: true,
        links?: SignPageLinkConfig[]
    },
    forms:SignPageFormConfig[],
}

export interface SignPageFormConfig{
    key:string,
    selector:string,
    condition:string,
    next?:string,
    title?:Translate
    config?:unknown,
}
export interface SignPageLinkConfig{
    title:Translate,
    url:string
}

export interface MarketingConfig {
    logo?: {
        text?: string,
        logoUrl?: string,
    },
    color?: string,
    backgroundImage?: string,
    backgroundColor?: string,
    html?:string,
}
