import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService, Translate } from './language.service';

@Injectable({ providedIn: 'root' })
export class XmTranslateService {
    constructor(
        private languageService: LanguageService,
        private translateService: TranslateService,
    ) {
    }

    /**
     * @params {(string | { en?: string; [locale: string]: string })} text
     * @description translate
     * @example
     *  {{ {en: 'Hi', ru: 'Хай'} | translate }}
     *  // returns Hi
     * @example
     *  {{ 'global.common.accept' | translate }}
     *  // returns Accept
     */
    public translate(text: Translate, interpolateParams: object): string | null {
        if (typeof text === 'object' && text !== null) {
            return this.translateService.instant(text[this.languageService.locale], interpolateParams);
        } else if (typeof text === 'string') {
            return this.translateService.instant(text, interpolateParams);
        } else {
            return null;
        }
    }
}
