import { Injectable, OnDestroy } from '@angular/core';
import { Translate } from '@xm-ngx/translation';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ColumnsSettingStorageItem {
    name: string;
    title: Translate;
    hidden: boolean;
    isHideLock: boolean;
}

export const COLUMNS_SETTING_STORE_NAME = 'XmTableSettingStoreState';

export interface XmTableSettingStoreStateItem {
    columns: ColumnsSettingStorageItem[]
}

type XmTableSettingStoreState = Record<string, XmTableSettingStoreStateItem>;

@Injectable({
    providedIn: 'root',
})
export class XmTableSettingStore implements OnDestroy {
    private readonly store: BehaviorSubject<XmTableSettingStoreState>;

    constructor(
        private localStorage: LocalStorageService,
    ) {
        const state: XmTableSettingStoreState = this.localStorage.retrieve(COLUMNS_SETTING_STORE_NAME) || {};
        this.store = new BehaviorSubject<XmTableSettingStoreState>(state);
        this.store.subscribe(value => {
            this.localStorage.store(COLUMNS_SETTING_STORE_NAME, value);
        });
    }

    public ngOnDestroy(): void {
        this.store.complete();
    }

    private getSettingsByKey(key: string): XmTableSettingStoreStateItem {
        return this.store.value[key];
    }

    public updateStore(key: string, value: XmTableSettingStoreStateItem): void {
        const state = this.store.value;
        state[key] = value;
        this.store.next(state);
    }

    public defaultStore(key: string, items: XmTableSettingStoreStateItem): void {
        const settings = this.getSettingsByKey(key);
        const hasChanges = this.hasColumnChanges(settings, items);

        if (hasChanges) {
            this.updateStore(key, items);
        }
    }

    public getStore(key: string): Observable<XmTableSettingStoreStateItem> {
        return this.store.pipe(
            map(i => i[key]),
        );
    }

    public clearStore(key: string): void {
        const state = this.store.value;
        delete state[key];
        this.store.next(state);
    }

    private hasColumnChanges(s1: XmTableSettingStoreStateItem, s2: XmTableSettingStoreStateItem): boolean {
        const c1 = (s1?.columns ?? []).map(s => s.name).join(',');
        const c2 = (s2?.columns ?? []).map(s => s.name).join(',');

        return c1 !== c2;
    }
}

@Injectable()
export class XmTableColumnsSettingStorageService {
    private _key: string;

    constructor(
        private XmTableColumnsSettingStorageService: XmTableSettingStore,
    ) {
    }

    public set key(key: string) {
        this._key = key;
    }
    public get key(): string {
        return this._key;
    }

    public updateStore(columns: ColumnsSettingStorageItem[]): void {
        this.XmTableColumnsSettingStorageService.updateStore(this.key, { columns });
    }

    public defaultStore(columns: ColumnsSettingStorageItem[]): void {
        this.XmTableColumnsSettingStorageService.defaultStore(this.key, { columns });
    }

    public getStore(): Observable<ColumnsSettingStorageItem[]> {
        return this.XmTableColumnsSettingStorageService.getStore(this.key).pipe(
            map(storageStateItem => storageStateItem?.columns ?? []),
        );
    }

    public clearStore(): void {
        this.XmTableColumnsSettingStorageService.clearStore(this.key);
    }
}
