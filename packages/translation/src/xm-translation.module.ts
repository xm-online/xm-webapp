import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JhiLanguageService } from '@xm-ngx/jhipster';

import { XmJhiLanguageService } from './services/jhiLanguage.service';
import { JhiLanguageHelper } from './services/language.helper';
import { LanguageService } from './services/language.service';
import './locales';
import { ModulesLanguageHelper } from './services/modules-language.helper';
import { TranslateDirective } from './directives/translate.directive';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslateLoader } from '@ngx-translate/core';
import { catchError, forkJoin, map, Observable, of, switchMap, take } from 'rxjs';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS, XmPublicUiConfigService } from '@xm-ngx/core';
import { filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';

export const URL_TRANSLATION = 'config/api/profile/webapp/public/translations/';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

export function CompositeLoaderFactory(http: HttpClient, publicUiConfigService: XmPublicUiConfigService): TranslateLoader {
    const loaders = [
        new TranslateHttpLoader(http, './i18n/', '.json'),
        new CustomTranslateLoader(http, publicUiConfigService),
    ];

    return new CompositeTranslateLoader(loaders);
}

export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient, private publicUiConfigService: XmPublicUiConfigService) {
    }

    public getTranslation(lang: string): Observable<object> {
        return this.publicUiConfigService.config$()
            .pipe(
                filter((res) => !isEmpty(res)),
                take(1),
                switchMap((publicUiConfig) => {
                    if (publicUiConfig.translationsFromMsConfig) {
                        return this.http.get<object>(URL_TRANSLATION + `${lang}.json`, {headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS})
                            .pipe(
                                catchError((error: HttpErrorResponse) => {
                                    console.warn(error);
                                    return of({});
                                }),
                            );
                    }
                    return of({});
                }));
    }
}

export class CompositeTranslateLoader implements TranslateLoader {
    constructor(private loaders: TranslateLoader[]) {
    }

    public getTranslation(lang: string): Observable<any> {
        return forkJoin(this.loaders.map(loader => loader.getTranslation(lang).pipe(
            catchError((error) => {
                console.warn(error);
                return of({});
            }),
        ))).pipe(
            map(response => Object.assign({}, ...response)),
        );
    }
}

@NgModule({
    imports: [CommonModule],
    declarations: [TranslatePipe, TranslateDirective],
    providers: [
        TranslatePipe,
        JhiLanguageHelper,
        {provide: JhiLanguageService, useClass: XmJhiLanguageService, deps: [LanguageService]},
        ModulesLanguageHelper,
    ],
    exports: [TranslatePipe, TranslateDirective],
})
export class XmTranslationModule {
    public static forRoot(): ModuleWithProviders<XmTranslationModule> {
        return {
            ngModule: XmTranslationModule,
            providers: [
                {provide: JhiLanguageService, useClass: XmJhiLanguageService, deps: [LanguageService]},
                Title,
                {
                    provide: LOCALE_ID,
                    deps: [LanguageService],
                    useFactory(LocaleService: LanguageService) {
                        return LocaleService.locale;
                    },
                },
                LanguageService,
            ],
        };
    }

    public static forChild(): ModuleWithProviders<XmTranslationModule> {
        return {
            ngModule: XmTranslationModule,
            providers: [],
        };
    }

}
