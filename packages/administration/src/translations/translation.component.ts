import { Component, Input, OnInit } from '@angular/core';
import { download } from '@xm-ngx/shared/operators';
import { combineLatest, Observable, ReplaySubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';

import { KeysExtractorOptions, TranslationStoreService } from './services/translation-store.service';
import { Config, TranslationService } from './services/translation.service';

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
    private selectedLang: Subject<string> = new ReplaySubject<string>(1);

    public translations$: Observable<object> = this.getTranslations();

    constructor(private translationKeysStoreService: TranslationStoreService,
                private translationService: TranslationService) {
    }

    public ngOnInit(): void {
        this.initGetTranslations();
    }

    private loadConfig(): Observable<Config> {
        return this.translationService.loadConfig().pipe(
            map((res) => {
                res.exts = [coreName, ...res.exts];
                return res
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
        this.selectedLang.next(value);
    }

    public updateTranslate(newTranslate: { key: string; value: string }): void {
        this.getPath$().pipe(
            take(1),
        ).subscribe((path) => this.translationKeysStoreService.updateKeys(path, newTranslate))
    }

    public downloadAssets(): void {
        this.getPath$().pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path).pipe(
                map((res) => ({keys: res, name: path})),
            )),
            take(1),
        ).subscribe(({keys, name}) => {
            download(JSON.stringify(keys, null, 2), name, 'application/json');
        })
    }

    public clearCache(): void {
        this.getPath$().pipe(
            switchMap((path) => this.translationService
                .getCombinedKeys(path, this.config.extractorFromBackend)
                .pipe(map((res) => ({path, res}))),
            ),
        ).subscribe(({path, res}) => this.translationKeysStoreService.updateStore(path, res))
    }

    private getTranslations(): Observable<object> {
        return this.getPath$().pipe(
            switchMap((path) => this.translationKeysStoreService.getKeysFromStore(path)),
        )
    }

    private initGetTranslations(): void {
        this.getPath$().pipe(
            filter((path) => !this.translationKeysStoreService.isExist(path)),
            switchMap((path) => this.translationService
                .getCombinedKeys(path, this.config.extractorFromBackend)
                .pipe(map((res) => ({path, res}))),
            ),
        ).subscribe(({path, res}) => this.translationKeysStoreService.updateStore(path, res))
    }

    private getPath$(): Observable<string> {
        return combineLatest([
            this.selectedExt,
            this.selectedLang,
        ]).pipe(
            distinctUntilChanged(
                ([prevExt, prevLang], [currExt, currLang],
                ) => prevExt === currExt && prevLang === currLang),
            map(([ext, lang]) => ext === 'core' ? `./i18n/${lang}/core.json` : `./i18n/ext/${lang}/${ext}.json`),
        )
    }
}
