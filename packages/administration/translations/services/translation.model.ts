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

export interface ModalLanguageList {
    langs: string[];
}
