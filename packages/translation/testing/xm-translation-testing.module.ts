import { EventEmitter, Injectable, NgModule, Pipe, PipeTransform } from '@angular/core';
import { DefaultLangChangeEvent, LangChangeEvent, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { LanguageService, TranslatePipe, XmTranslateService } from '@xm-ngx/translation';
import { Observable, of } from 'rxjs';
import { MockXmTranslateService } from './mock-xm-translate.service';

@Injectable()
@Pipe({standalone: false, name: 'translate'})
/** @public */
export class MockTranslatePipe implements PipeTransform {
    public transform: (args: string) => Observable<string> = (arg) => of(arg);
}

/** @public */
export class MockTranslateService {
    public onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter<TranslationChangeEvent>();
    public onLangChange: EventEmitter<LangChangeEvent> = new EventEmitter<LangChangeEvent>();
    public onDefaultLangChange: EventEmitter<DefaultLangChangeEvent> = new EventEmitter<DefaultLangChangeEvent>();
    public get: (i: string) => Observable<string> = (arg) => of(arg);
}

/** @public */
export class MockLanguageService {
    public languages = [];
    public getDefaultLocale: () => 'en';
    public locale: string = 'en';
    public languages$: (i: string) => Observable<string[]> = () => of([]);
}

@NgModule({
    declarations: [MockTranslatePipe],
    exports: [MockTranslatePipe],
    providers: [
        {provide: LanguageService, useClass: MockLanguageService},
        {provide: TranslatePipe, useClass: MockTranslatePipe},
        {provide: TranslateService, useClass: MockTranslateService},
        {provide: XmTranslateService, useClass: MockXmTranslateService},
    ],
})
/** @public */
export class XmTranslationTestingModule {
}
