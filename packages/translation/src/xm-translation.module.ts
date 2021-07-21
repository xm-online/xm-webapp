import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JhiLanguageService } from 'ng-jhipster';

import { XmJhiLanguageService } from './services/jhiLanguage.service';
import { JhiLanguageHelper } from './services/language.helper';
import { LanguageService } from './services/language.service';
import './locales';
import { ModulesLanguageHelper } from './services/modules-language.helper';
import { TranslateDirective } from './directives/translate.directive';
import { TranslatePipe } from './pipes/translate.pipe';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
    imports: [CommonModule],
    declarations: [TranslatePipe, TranslateDirective],
    providers: [
        TranslatePipe,
        JhiLanguageHelper,
        { provide: JhiLanguageService, useClass: XmJhiLanguageService, deps: [LanguageService] },
        ModulesLanguageHelper,
    ],
    exports: [TranslatePipe, TranslateDirective],
})
export class XmTranslationModule {
    public static forRoot(): ModuleWithProviders<XmTranslationModule> {
        return {
            ngModule: XmTranslationModule,
            providers: [
                { provide: JhiLanguageService, useClass: XmJhiLanguageService, deps: [LanguageService] },
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
