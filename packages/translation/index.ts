export { TranslateDirective } from './src/directives/translate.directive';

export { getBrowserLocale } from './src/operators/getBrowserLocale';

export { ITrKeyTranslates, TranslatePipe } from './src/pipes/translate.pipe';

export {
    ITranslate,
    Translate,
    EVENT_CHANGE_LOCALE,
    Locale,
    SESSION_LOCALE,
    LanguageService
} from './src/services/language.service';
export { JhiLanguageHelper } from './src/services/language.helper';
export { ModulesLanguageHelper } from './src/services/modules-language.helper';
export { DEFAULT_TITLE, TitleService, IRouteDate } from './src/services/title.service';
export { XmTranslateService } from './src/services/xm-translate-service';

export { LANGUAGES } from './src/language.constants';
export { XmTranslationModule, HttpLoaderFactory } from './src/xm-translation.module';


// Deprecated use @xm-ngx/translation/testing
export {
    XmTranslationTestingModule,
    MockTranslatePipe,
    MockTranslateService,
} from './testing';
