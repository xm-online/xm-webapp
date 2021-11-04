import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiEventManager } from 'ng-jhipster';
import { SessionStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';

import { Principal } from '../../shared/auth/principal.service';
import { LANGUAGES } from '../../shared/language/language.constants';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { getBrowserLocale } from './getBrowserLocale';
import { OnInitialize } from './title.service';

export interface ITranslate {
    en?: string;
    ru?: string;
    uk?: string;

    [locale: string]: string;
}

export type Translate = ITranslate | string;

export const EVENT_CHANGE_LOCALE = 'TRANSLATION.EVENT_CHANGE_LOCALE';
export const SESSION_LOCALE = 'currentLang';
export const DEFAULT_LOCALE = LANGUAGES[0];

export type Locale = string | 'en' | 'ru' | 'uk';

@Injectable({providedIn: 'root'})
export class LanguageService implements OnDestroy, OnInitialize {
    public locale$: Observable<Locale | null>;

    protected $locale: BehaviorSubject<Locale>;

    constructor(protected principal: Principal,
                protected eventManager: JhiEventManager,
                protected translate: TranslateService,
                protected appConfig: XmApplicationConfigService,
                protected sessionStorage: SessionStorageService) {
        this.$locale = new BehaviorSubject<Locale | null>(null);
        this.locale$ = this.$locale.asObservable();
    }

    public get locale(): Locale {
        return this.$locale.getValue()
            || this.getUserLocale()
            || this.getSessionLocale()
            || this.getBrowserLocale()
            || this.getConfigLocale()
            || this.getDefaultLocale();
    }

    public set locale(value: Locale) {
        this.update(value);
        console.info('TRANSLATION Locale changed:', value);
    }

    /** @description Get languages list */
    public get languages(): Locale[] {
        return LANGUAGES;
    }

    public ngOnDestroy(): void {
        this.$locale.complete();
    }

    /** @description Set html lang
     *  @example <html lang="en">
     */
    public setLangHTMLAttr(locale: Locale): void {
        document.documentElement.setAttribute('lang', locale);
    }

    /** @description Get the user locale */
    public getUserLocale(): Locale | null {
        return this.principal.getLangKey();
    }

    /** @description Get a locale form the session Storage */
    public getSessionLocale(): Locale | null {
        return this.sessionStorage.retrieve(SESSION_LOCALE);
    }

    /** @description Get a locale form the xm-webapp configuration */
    public getConfigLocale(): Locale | null {
        const config = this.appConfig.getAppConfig();
        return (config && config.langs && config.langs[0]) ? config.langs[0] : null;
    }

    /** @description Get a locale form the browser */
    public getBrowserLocale(): Locale | null {
        const locale = getBrowserLocale();
        return locale && this.languages.includes(locale) ? locale : null;
    }

    /** @description Get a default locale */
    public getDefaultLocale(): Locale {
        return DEFAULT_LOCALE;
    }

    public init(): void {
        const locale = this.locale;
        this.translate.setDefaultLang(locale);
        this.update(locale);
    }

    protected update(locale: string): void {
        // TODO v2: rewrite below as listeners of the $locale
        this.translate.use(locale);
        this.principal.setLangKey(locale);
        this.sessionStorage.store(SESSION_LOCALE, locale);
        this.translate.getTranslation(locale).subscribe((res) => {
            LANGUAGES.forEach((lang) => this.sessionStorage.clear(lang));
            this.sessionStorage.store(locale, JSON.stringify(res));
        });
        this.setLangHTMLAttr(locale);

        this.$locale.next(locale);
        this.eventManager.broadcast({name: EVENT_CHANGE_LOCALE, content: locale});
    }

}
