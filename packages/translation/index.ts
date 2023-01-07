export { TranslateDirective } from './src/directives/translate.directive';

export { getBrowserLocale } from './src/operators/getBrowserLocale';

export { ITrKeyTranslates, TranslatePipe } from './src/pipes/translate.pipe';

export {
    ITranslate,
    Translate,
    EVENT_CHANGE_LOCALE,
    Locale,
    SESSION_LOCALE,
    LanguageService,
} from './src/services/language.service';
export { JhiLanguageHelper } from './src/services/language.helper';
export { ModulesLanguageHelper } from './src/services/modules-language.helper';
export { DEFAULT_TITLE, TitleService, IRouteDate } from './src/services/title.service';
export { XmTranslateService } from './src/services/xm-translate-service';

export { LANGUAGES } from './src/language.constants';
export { XmTranslationModule, HttpLoaderFactory } from './src/xm-translation.module';

export { FindLanguageFromKeyPipe } from './src/pipes/find-language-from-key.pipe';
export { I18nJsfPipe } from './src/pipes/i18n-jsf.pipe';
export { I18nNamePipe } from './src/pipes/i18n-name.pipe';
export { LanguageModule } from './src/language.module';
