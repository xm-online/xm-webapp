import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { download, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, map, switchMap, take, tap } from 'rxjs/operators';

import { KeysExtractorOptions, TranslationStoreService } from './services/translation-store.service';
import { TranslationService, XmLanguageUiConfig } from './services/translation.service';
import { TranslationConfigService } from './services/translation-config.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageObj, TranslationObject, TranslationProp } from './services/translation.model';

const coreName = 'core';

@Component({
    selector: 'xm-translation',
    templateUrl: './translation.component.html',
    styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent implements OnInit, OnDestroy {
    @Input() public config: KeysExtractorOptions;

    public extNames$: Observable<string[]> = this.loadConfig().pipe(map((res) => res.exts));
    public langs$: Observable<string[]> = this.loadConfig().pipe(map((res) => res.langs));

    private selectedExt: Subject<string> = new ReplaySubject<string>(1);
    private selectedLang$: Subject<string> = new ReplaySubject<string>(1);
    public selectedLang: string = 'en';

    public translations$: Observable<object> = this.getTranslations();
    public translationsConfig$: Observable<object> = this.getTranslationsFromConfig();

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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

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


    public getTranslationsFromConfig(language?: string): Observable<TranslationObject> {
        this.loading = true;
        return this.translationConfigService.loadConfigTranslations(language || this.selectedLang).pipe(
            tap((res: TranslationObject) => {
                this.loading = false;
                this.translationsConfig = res;
            }),
        );
    }

    public updateTranslateFromConfig(newTranslate: TranslationProp, language?: string): void {
        this.loading = true;
        this.translationConfigService.loadConfigTranslations(language || this.selectedLang)
            .pipe(
                switchMap((currentTranslations) => {
                    const translationsConfig = this.translationConfigService
                        .setToObject(currentTranslations, newTranslate.key, newTranslate.value);
                    return this.translationConfigService.updateConfigTranslations(translationsConfig, language || this.selectedLang).pipe(
                        map(() => translationsConfig),
                    );
                }),
                tap(updatedTranslations => {
                    if (!language || language === this.selectedLang) {
                        this.translationsConfig$ = of({...updatedTranslations});
                    }
                    this.coreTranslationService.setTranslation(this.selectedLang, updatedTranslations, true);
                }),
                take(1),
                finalize(() => this.loading = false),
            )
            .subscribe();
    }

    public deleteTranslation(translationKey: string): void {
        this.loading = true;
        this.selectedLang$.pipe(
            switchMap((lang: string) => this.getTranslationsFromConfig(lang).pipe(tap(() => this.loading = true))),
            map(translationsConfig => this.translationConfigService.deleteFromObject(translationsConfig, translationKey)),
            switchMap(currentTranslations => this.translationConfigService
                .updateConfigTranslations(currentTranslations, this.selectedLang).pipe(
                    tap(() => {
                        this.translationsConfig$ = of({...currentTranslations});
                        this.coreTranslationService.setTranslation(this.selectedLang, currentTranslations);
                    }),
                )),
            take(1),
            finalize(() => this.loading = false),
        ).subscribe();
    }


    public addNewTranslation(translations: LanguageObj): void {
        for (const translation of translations.value) {
            this.updateTranslateFromConfig({key: translations.key, value: translation.name}, translation.languageKey);
        }

    }
}

