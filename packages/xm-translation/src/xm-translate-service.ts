import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Interpolate, interpolate } from '@xm-ngx/shared/operators';
import { LanguageService, Translate } from './language.service';

@Injectable({ providedIn: 'root' })
export class XmTranslateService {
    constructor(
        private languageService: LanguageService,
        private translateService: TranslateService,
    ) {
    }

    public interpolate(text: Interpolate, interpolateParams: object): string {
        return interpolate(text, interpolateParams);
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
    public translate(text: Translate, interpolateParams: object = {}): string | null {
        if (typeof text === 'object' && text !== null) {
            const str = text[this.languageService.locale];
            const interpolated = this.interpolate(str, interpolateParams);
            return interpolated ? this.translateService.instant(interpolated, interpolateParams) : '';
        } else if (typeof text === 'string') {
            const interpolated = this.interpolate(text, interpolateParams);
            return interpolated ? this.translateService.instant(interpolated, interpolateParams) : '';
        } else {
            return null;
        }
    }
}
