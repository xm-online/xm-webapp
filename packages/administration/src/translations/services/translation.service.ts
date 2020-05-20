import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { fromStringToObject } from './helpers';
import { ExtractorFromBackend } from './translation-store.service';

export interface Config {
    exts: string[];
    langs: string[];
}

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    constructor(
        private httpClient: HttpClient,
    ) { }

    public getFileWithTranslates(path: string): Observable<{}> {
        return this.httpClient.get<{}>(path);
    }

    public loadConfig(): Observable<Config> {
        return this.httpClient.get<Config>('./i18n/settings.json');
    }

    public getCombinedKeys(keysName: string, additionalKeys: ExtractorFromBackend): Observable<{}> {
        return this.getFileWithTranslates(keysName).pipe(
            switchMap((res) => {
                const isExistBackendKeys = additionalKeys
                    && additionalKeys?.requestUrls.length > 0
                    && keysName.includes(additionalKeys?.extJsonName);

                if (!isExistBackendKeys) {
                    return of(res)
                }

                return this.getKeysFromBackend(additionalKeys).pipe(
                    map((additionalKeys) => additionalKeys.reduce(
                        (acc, additionalKey) => merge(acc, fromStringToObject(additionalKey, '')), {},
                    )),
                    map((additionalKeys) => merge(additionalKeys, res)),
                );
            }),
        );
    }

    private getKeysFromBackend(additionalKeys: ExtractorFromBackend): Observable<string[]> {
        return combineLatest([
            ...additionalKeys.requestUrls.map((url) => this.httpClient[url.method](url.url, {} as any)),
        ]).pipe(
            map((res) => {
                const regexForExtractKeys = new RegExp(`(${additionalKeys.translationKeyName}.*?)"`, 'gu');
                return (JSON.stringify(res).match(regexForExtractKeys) || [])
                    .map(e => e.replace(regexForExtractKeys, '$1'));
            }),
        );
    }
}
