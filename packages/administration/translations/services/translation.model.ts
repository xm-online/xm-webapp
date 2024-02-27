import { Translate } from '@xm-ngx/translation';

export interface LanguageObj {
    key: string;
    value: LanguageTranslation[];
}

export interface LanguageTranslation {
    languageKey: string;
    name: string;
}

export interface TranslationObject {
    [key: string]: string | TranslationObject;
}

export interface TranslationProp {
    key: string;
    value: string;
}

export interface ModalTranslationConfig {
    langs: string[];
    translations?: {
        modal: {
            title: Translate,
            form: {
                key: Translate,
                value: Translate,
                cancel: Translate,
                add: Translate
            }
        }
    };
}

