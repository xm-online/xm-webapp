import { Component, Input, OnInit } from '@angular/core';
import { download } from '@xm-ngx/operators';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { KeysExtractorOptions, TranslationStoreService } from './services/translation-store.service';
import { TranslationService, XmLanguageUiConfig } from './services/translation.service';
import { TranslationConfigService } from '@xm-ngx/administration/translations/services/translation-config.service';

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
    public translationsConfig$: Observable<any> = this.getConfigTranslations();

    public isConfig: boolean = false;
    public translationsConfig;

    constructor(private translationKeysStoreService: TranslationStoreService,
                private translationConfigService: TranslationConfigService,
                private translationService: TranslationService,) {
    }

    public ngOnInit(): void {
        this.initGetTranslations();
        this.config;

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
            debugger
            return this.translationKeysStoreService.updateStore(path, res);
        });
    }

    private getTranslations(): Observable<object> {
        return this.getPath$().pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path)),
            tap((res) => {
                debugger
                res
            })
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

        this.getConfigPath$().pipe(
            filter((path) => !this.translationKeysStoreService.isExist(path)),
            switchMap((path) => this.translationConfigService.loadConfig(this.selectedLang)
                .pipe(map((res) => ({path, res}))),
            ),
        ).subscribe(({path, res}) => {
            debugger
            this.translationKeysStoreService.updateStore(path, res);
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

    private getConfigPath$(language?: string): Observable<string> {
        if (language) {
            return of('config/api/profile/webapp/public/translations/' + `${language}.json`);
        }
        return this.selectedLang$.pipe(map((lang) => {
            return 'config/api/profile/webapp/public/translations/' + `${lang}.json`;
        }));

    }


    public getConfigTranslations(language?: string): Observable<any> {
        return this.getConfigPath$(language).pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path)),
            tap((res) => {
                this.translationsConfig = res;
            }),
        );
    }

    public updateConfigTranslate(newTranslate: { key: string; value: string }, language?: string): void {
        combineLatest([this.getConfigTranslations(language), this.getConfigPath$(language)]).pipe(take(1))
            .subscribe(([translationsConfig, path]) => {
                this.setToObject(translationsConfig, newTranslate.key, newTranslate.value);
                this.translationKeysStoreService.updateKeys(path, newTranslate);
                this.translationConfigService.updateConfig(translationsConfig, language || this.selectedLang).pipe()
                    .subscribe((res)=>{
                    debugger
                    res
                })
            });


    }

    private setToObject(obj: any, prop: string, value: any): void {
        const index = prop.indexOf('.');
        if (index > -1) {
            const key = prop.substring(0, index);
            if (!obj[key] || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            this.setToObject(obj[key], prop.substring(index + 1), value);
        } else {
            obj[prop] = value;
        }
    }


    public addNewTranslation(translations: LanguageObj): void {
        for (const translation of translations.value) {
            this.updateConfigTranslate({key: translations.key, value: translation.name}, translation.languageKey);
        }

    }


}

export interface LanguageContent {
    language: string;
    content: any;
}

interface LanguageObj {
    key: string,
    value: LanguageTranslation[]
}

interface LanguageTranslation {
    languageKey: string,
    name: string,
}
