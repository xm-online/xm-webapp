import { Injectable } from '@angular/core';
import { Translate } from '@xm-ngx/translation';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ColumnsSettingStorageItem {
    name: string;
    title: Translate;
    hidden: boolean;
}

export const COLUMNS_SETTING_STORE_NAME = '[columns setting] store';

@Injectable({
    providedIn: 'root',
})
export class ColumnsSettingStorageService {
    private store: BehaviorSubject<ColumnsSettingStorageItem[]> =
        new BehaviorSubject<ColumnsSettingStorageItem[]>(this.localStorage.retrieve(COLUMNS_SETTING_STORE_NAME) || null);

    constructor(
        private localStorage: LocalStorageService,
    ) {
    }

    public updateStore(items: ColumnsSettingStorageItem[]): void {
        this.store.next(items);
        this.localStorage.store(COLUMNS_SETTING_STORE_NAME, this.store.value);
    }

    public getStore(): Observable<ColumnsSettingStorageItem[]> {
        return this.store.asObservable();
    }

    public clearStore(): void {
        this.localStorage.clear(COLUMNS_SETTING_STORE_NAME);
    }
}
