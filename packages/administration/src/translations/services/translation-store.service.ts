import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { setToObject } from './helpers';

export interface StoreItem {
    isChange: boolean;
    keys: {};
}

export interface ExtractorRequestUrl {
    url: string;
    method: 'post' | 'get';
}

export interface ExtractorFromBackend {
    /**
     * ExtJsonName is json file name. For example: extName for OBM equals "obm-ext"
     */
    extJsonName: string;
    /**
     * TranslationKeyName is root key for translation. For example: translationKeyName for OBM equals "ext-tenant-obm"
     */
    translationKeyName: string;
    requestUrls: ExtractorRequestUrl[];
}

export interface KeysExtractorOptions {
    extractorFromBackend: ExtractorFromBackend;
}

export const TRANSLATION_STORE_NAME = '[translation] store';

@Injectable({
    providedIn: 'root',
})
export class TranslationStoreService {
    private store: BehaviorSubject<{ [p: string]: StoreItem }> =
        new BehaviorSubject<{ [name: string]: StoreItem }>(this.localStorage.retrieve(TRANSLATION_STORE_NAME) || {});

    constructor(private localStorage: LocalStorageService) {
    }

    public getKeysFromStore(keysName: string): Observable<{}> {
        return this.getFromStore(keysName);
    }

    public updateKeys(keysName: string, newTranslate: { key: string; value: string }): void {
        const newKeys = {...this.store.getValue()[keysName].keys};
        setToObject(newKeys, newTranslate.key, newTranslate.value);

        this.updateStore(keysName, newKeys, true);
    }

    public getKeysWithChanges(): [string, {}][] {
        const storeItems = this.store.getValue();

        return Object.entries(storeItems)
            .filter(([itemName, storeItem]) => storeItem.isChange)
            .map(([itemName, storeItem]) => ([itemName, storeItem.keys]));
    }

    public getKeysWithChanges$(): Observable<[string, {}][]> {
        return this.store.pipe(
            map((storeItems) =>
                Object.entries(storeItems)
                    .filter(([itemName, storeItem]) => storeItem.isChange)
                    .map(([itemName, storeItem]) => ([itemName, storeItem.keys])),
            ),
        )
    }

    public isExist(keysName: string): StoreItem {
        return this.store.getValue()[keysName];
    }

    public updateStore(keysName: string, keys: {}, isChange: boolean = false): void {
        this.store.next({...this.store.getValue(), [keysName]: {isChange, keys: keys}});
        this.localStorage.store(TRANSLATION_STORE_NAME, this.store.value);
    }

    private getFromStore(keysName: string): Observable<{}> {
        return this.store.pipe(map((store) => store[keysName]?.keys || {}))
    }
}
