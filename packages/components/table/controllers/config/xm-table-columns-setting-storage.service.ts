import { inject, Injectable, OnDestroy } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { PermissionCheckStrategy, XmPermissionService } from '@xm-ngx/core/permission';
import { Translate } from '@xm-ngx/translation';
import { isEqual } from 'lodash';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

export interface ColumnsSettingStorageItem {
    name: string;
    title: Translate;
    hidden: boolean;
    isHideLock: boolean;
    permission?: any;
    permissionStrategy?: string;
    storageColumn?: boolean;
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
        private eventManager: XmEventManager,
    ) {
        const state: XmTableSettingStoreState = this.localStorage.retrieve(COLUMNS_SETTING_STORE_NAME) || {};
        this.store = new BehaviorSubject<XmTableSettingStoreState>(state);
        this.store.subscribe(value => {
            this.localStorage.store(COLUMNS_SETTING_STORE_NAME, value);
        });

        this.eventManager.listenTo('USER-LOGOUT').subscribe((): void => {
            this.localStorage.clear(COLUMNS_SETTING_STORE_NAME);
            this.store.next({});
        });
    }

    public ngOnDestroy(): void {
        this.store.complete();
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
            // TODO: the following code could use not only "name" as uniq key for columns but "field" too. Need to double-check.
            const ls = Object.fromEntries((settings?.columns || []).map(v => [v.name, v]));
            const columns = items.columns.map(col => {
                if (ls[col.name] && ls[col.name].isHideLock === col.isHideLock) {
                    col.hidden = ls[col.name].hidden;
                }
                return col;
            });

            this.updateStore(key, {columns});
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

    private getSettingsByKey(key: string): XmTableSettingStoreStateItem {
        return this.store.value[key];
    }

    private hasColumnChanges(s1: XmTableSettingStoreStateItem, s2: XmTableSettingStoreStateItem): boolean {
        return !isEqual(s1, s2);
    }
}

@Injectable({providedIn: 'root'})
export class XmTableColumnsSettingStorageService {
    private XmTableColumnsSettingStorageService = inject(XmTableSettingStore);
    private permissionService = inject(XmPermissionService);

    private _key: string;

    public get key(): string {
        return this._key;
    }

    public set key(key: string) {
        this._key = key;
    }

    public updateStore(columns: ColumnsSettingStorageItem[]): void {
        this.XmTableColumnsSettingStorageService.updateStore(this.key, {columns});
    }

    public defaultStore(columns: ColumnsSettingStorageItem[]): void {
        this.XmTableColumnsSettingStorageService.defaultStore(this.key, {columns});
    }

    public getStore(): Observable<ColumnsSettingStorageItem[]> {
        return this.XmTableColumnsSettingStorageService.getStore(this.key).pipe(
            map(storageStateItem => storageStateItem?.columns ?? []),
            withLatestFrom(this.permissionService.privileges$()),
            switchMap(([columns, __]) => {
                if (!columns?.length) {
                    return of([]);
                }

                const columnsByName = new Map(columns.map((c) => [c.name, c]));
                return forkJoin(columns.reduce((acc, column) => {
                    const permitted = !column.permission || column.permission === true || column.permission.length === 0
                        ? of(column.permission !== false)
                        : this.permissionService.hasPrivilegesBy(column.permission, column.permissionStrategy as PermissionCheckStrategy).pipe(take(1));

                    return {
                        ...acc,
                        [column.name]: permitted,
                    };
                }, {})).pipe(
                    map((permitted) => {
                        return Object.entries(permitted)
                            .filter(([__, permitted]) => !!permitted)
                            .map(([name, __]) => {
                                return columnsByName.get(name);
                            });
                    }),
                );
            }),
            tap((res) => {
                if (res) {
                    this.defaultStore(res);
                }
            })
        );
    }

    public clearStore(): void {
        this.XmTableColumnsSettingStorageService.clearStore(this.key);
    }
}
