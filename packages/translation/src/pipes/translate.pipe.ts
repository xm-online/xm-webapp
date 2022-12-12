import { ChangeDetectorRef, Injectable, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe as NgxTranslate, TranslateService } from '@ngx-translate/core';

import { ITranslate, LanguageService, Translate } from '../services/language.service';

export interface ITrKeyTranslates {
    trKey: string;
}

@Injectable()
@Pipe({
    name: 'translate',
    pure: false,
})
export class TranslatePipe extends NgxTranslate implements PipeTransform, OnDestroy {

    constructor(protected translateService: TranslateService,
                private languageService: LanguageService,
                @Optional() cdr: ChangeDetectorRef) {
        super(translateService, cdr);
    }

    /**
     * translate
     * @param value - contains translations key
     *
     * @example
     * ```
     *  // returns Hi
     *  {{ {en: 'Hi', ru: 'хай'} | translate }}
     * ```
     * @example
     * ```
     *  // returns Accept
     *  {{ 'global.common.accept' | translate }}
     * ```
     */
    public transform(value: Translate, ...args: any[]): string | any {
        if (typeof value === 'object' && value !== null) {
            return this.processMap(value, args);
        } else if (typeof value === 'string') {
            return super.transform(value, ...args);
        }
        return value;

    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private processMap(map: ITranslate | ITrKeyTranslates, ...args: any[]): string | any {
        if (map.trKey) {
            return super.transform(map.trKey, ...args);
        }
        return map[this.languageService.locale]
                || map[this.languageService.getDefaultLocale()]
                || map[Object.keys(map)[0]];

    }
}
