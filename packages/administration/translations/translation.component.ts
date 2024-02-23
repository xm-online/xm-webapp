import { Component, Input, OnInit } from '@angular/core';
import { download } from '@xm-ngx/operators';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { KeysExtractorOptions, TranslationStoreService } from './services/translation-store.service';
import { TranslationService, XmLanguageUiConfig } from './services/translation.service';
import { TranslationConfigService } from './services/translation-config.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageObj, TranslationObject } from './services/translation.model';
import { URL_TRANSLATION } from '@xm-ngx/translation/src/xm-translation.module';

const coreName = 'core';

@Component({
    selector: 'xm-translation',
    templateUrl: './translation.component.html',
    styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent implements OnInit {
    @Input() public config: KeysExtractorOptions;

    public extNames$: Observable<string[]> = this.loadConfig().pipe(map((res) => res.exts));
    public langs$: Observable<string[]> = this.loadConfig().pipe(map((res) => res.langs));

    private selectedExt: Subject<string> = new ReplaySubject<string>(1);
    private selectedLang$: Subject<string> = new ReplaySubject<string>(1);
    public selectedLang: string = 'en';

    public translations$: Observable<object> = this.getTranslations();
    public translationsConfig$: Observable<any> = this.getTranslationsFromConfig();

    public translationsConfig: TranslationObject = {};
    public isConfig: boolean = false;
    public loading: boolean = false;


    constructor(private translationKeysStoreService: TranslationStoreService,
                private translationConfigService: TranslationConfigService,
                private translationService: TranslationService,
                private coreTranslationService: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        this.initGetTranslations();
    };

    private loadConfig(): Observable<XmLanguageUiConfig> {
        return this.translationService.loadConfig().pipe(
            map((res) => {
                res.exts = [coreName, ...res.exts];
                return res;
            }),
            tap((res) => {
                this.setExt(res.exts[0]);
                this.setLang(res.langs[0]);
            }),
        );
    }

    public setExt(value: string): void {
        this.selectedExt.next(value);
    }

    public setLang(value: string): void {
        this.selectedLang = value;
        this.selectedLang$.next(value);
        if (this.isConfig) {
            this.translationsConfig$ = this.getTranslationsFromConfig(value);
        }
    }

    public updateTranslate(newTranslate: { key: string; value: string }): void {
        this.getPath$().pipe(
            take(1),
        ).subscribe((path) => this.translationKeysStoreService.updateKeys(path, newTranslate));
    }


    public downloadAssets(): void {
        this.getPath$().pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path).pipe(
                map((res) => ({keys: res, name: path})),
            )),
            take(1),
        ).subscribe(({keys, name}) => {
            download(JSON.stringify(keys, null, 2), name, 'application/json');
        });
    }

    public clearCache(): void {
        this.getPath$().pipe(
            switchMap((path) => this.translationService
                .getCombinedKeys(path, this.config.extractorFromBackend)
                .pipe(map((res) => ({path, res}))),
            ),
        ).subscribe(({path, res}) => {
            return this.translationKeysStoreService.updateStore(path, res);
        });
    }

    private getTranslations(): Observable<object> {
        return this.getPath$().pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path)),
        );
    }


    private initGetTranslations(): void {
        this.getPath$().pipe(
            filter((path) => !this.translationKeysStoreService.isExist(path)),
            switchMap((path) => this.translationService
                .getCombinedKeys(path, this.config.extractorFromBackend)
                .pipe(map((res) => ({path, res}))),
            ),
        ).subscribe(({path, res}) => this.translationKeysStoreService.updateStore(path, res));

        this.getPathTranslationsFromConfig$().pipe().subscribe((res) => {
            return this.translationConfigService.loadConfigTranslations(this.selectedLang).pipe(map((res) => ({res})));
        });
    }


    private getPath$(): Observable<string> {
        return combineLatest([
            this.selectedExt,
            this.selectedLang$,
        ]).pipe(
            distinctUntilChanged(
                ([prevExt, prevLang], [currExt, currLang],
                ) => prevExt === currExt && prevLang === currLang),
            map(([ext, lang]) => ext === 'core' ? `./i18n/${lang}/core.json` : `./i18n/ext/${lang}/${ext}.json`),
        );
    }

    private getPathTranslationsFromConfig$(language?: string): Observable<string> {
        if (language) {
            return of(URL_TRANSLATION + `${language}.json`);
        }
        return this.selectedLang$.pipe(map((lang: string) => {
            return URL_TRANSLATION + `${lang}.json`;
        }));
    }


    public getTranslationsFromConfig(language?: string): Observable<TranslationObject> {
        return this.getPathTranslationsFromConfig$(language).pipe(
            switchMap((path) => this.translationConfigService.loadConfigTranslations(this.selectedLang)),
            tap((res: TranslationObject) => {
                this.translationsConfig = res;
            }),
        );
    }

    public updateTranslateFromConfig(newTranslate: { key: string; value: string }, language?: string): void {
        this.loading = true;
        this.translationConfigService.loadConfigTranslations(language||this.selectedLang).pipe(take(1))
            .subscribe((translationsConfig) => {
                const currentTranslations= this.translationConfigService.setToObject(translationsConfig, newTranslate.key, newTranslate.value);
                this.translationConfigService.updateConfigTranslations(currentTranslations, language || this.selectedLang).pipe()
                    .subscribe((res) => {
                        this.loading = false;
                        this.translationsConfig$ = of(Object.assign({}, currentTranslations));
                        this.coreTranslationService.setTranslation(language || this.selectedLang, currentTranslations, true);
                    }, error => {
                        this.loading = false;
                    });
            });
    }

    public deleteTranslation(translationKey: string): void {
        this.loading=true;
        this.selectedLang$.pipe(
            take(1),
            switchMap((lang)=>{
                return this.getTranslationsFromConfig(lang);
            }),
        ).subscribe((translationsConfig) => {
            const currentTranslations = this.translationConfigService.deleteFromObject(translationsConfig, translationKey);
            this.translationConfigService.updateConfigTranslations(currentTranslations, this.selectedLang).pipe()
                .subscribe((res) => {
                    this.translationsConfig$ = of(currentTranslations);
                    this.coreTranslationService.setTranslation(this.selectedLang, currentTranslations);
                    this.loading=false;
                }, error => {
                    error;
                    this.loading=false;
                });
        });
    }


    public addNewTranslation(translations: LanguageObj): void {
        for (const translation of translations.value) {
            this.updateTranslateFromConfig({key: translations.key, value: translation.name}, translation.languageKey);
        }

    }
}
