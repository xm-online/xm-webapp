import { inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { XmConfig } from '@xm-ngx/interfaces';
import { UUID } from 'angular2-uuid';
import { cloneDeep, get, isEqual, isFunction, omit, set } from 'lodash';
import { catchError, defaultIfEmpty, filter, finalize, isObservable, map, Observable, of, Subject, switchMap, take, tap } from 'rxjs';
import { XmTableEntityController } from '../controllers/entity/xm-table-entity-controller.service';
import { AXmTableLocalPageableCollectionController } from './a-xm-table-local-pageable-collection-controller.service';
import { IXmTableCollectionController, XmFilterQueryParams } from './i-xm-table-collection-controller';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmAlertService } from '@xm-ngx/alert';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { XmEntity } from '@xm-ngx/core/entity';

export interface XmTableEntity extends XmConfig {
    path: string;
    // Make one item of arrays work with table-array selector (search and display)
    buildItemAsNestedKey?: string;
    uuidKeyName?: string;
}

export interface XmTableArrayCollectionControllerConfig extends XmTableEntity {
    type: 'array',
    entityController?: {
        key?: string,
        method?: string;
    },
    save?: {
        controller?: {
            key: string;
            method: string;
        }
    }
    saveWithType?: boolean;
    /**
     * When true, re-fetches the entity from the backend (via the bound entity controller's
     * `getFresh$()`, if present) right after the user confirms removal, and uses it as the
     * base for the subsequent `save()` instead of the last value pushed through `entity$()`.
     * Mirrors `EntityDataWidgetComponent.onSave()`'s `refetchBeforeSave` behavior.
     */
    refetchBeforeSave?: boolean;
}

export type SaveType = 'ADD' | 'EDIT' | 'REMOVE';

export interface XmTableArrayCollectionItem extends XmEntity {
    uuidKeyOnCloned?: string;
}

@Injectable()
export class XmTableArrayCollectionController<T = XmTableArrayCollectionItem>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T>, OnDestroy {
    public declare config: XmTableArrayCollectionControllerConfig;
    private entity: object;

    private entityController = inject<XmTableEntityController<object>>(XmTableEntityController, {optional: true});
    protected toaster: XmToasterService = inject(XmToasterService);
    protected alert: XmAlertService = inject(XmAlertService);
    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);

    private syncRequest = new Subject<XmFilterQueryParams>();
    private removedItems: Array<T> = [];
    private _lastRequest: XmFilterQueryParams;
    /** Keys generated in `applyEntity()` for keyless rows (local-only identities). */
    private generatedKeys = new Set<string>();
    /** `add()` calls still waiting for the refetch; `save()` is deferred until they finish. */
    private pendingAdds = 0;
    private queuedSaves: Array<{type?: SaveType}> = [];
    /** Whether any deferred `add()` actually appended its row. */
    private hasCompletedAdd = false;

    constructor() {
        super();

        this.syncRequest.asObservable().pipe(
            switchMap((requestData: XmFilterQueryParams) => {
                this._lastRequest = requestData;
                const controller = this.getEntityController() as Record<string, () => Observable<unknown[]>>;
                const controllerMethod = this.config?.entityController?.method || 'entity$';

                if (!controller) {
                    return of(null);
                }

                const controllerFn = controller[controllerMethod];

                if (!isFunction(controllerFn)) {
                    return of(null);
                }

                const controllerSubscribe = controllerFn.call(controller) as Observable<unknown[]>;

                if (!isObservable(controllerSubscribe)) {
                    return of(null);
                }

                return controllerSubscribe.pipe(
                    tap((value) => this.applyEntity(value, requestData)),
                );
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
    }

    private applyEntity(value: object, requestData: XmFilterQueryParams): void {
        this.entity = value;
        this.generatedKeys.clear();

        const items = this.config?.path ? get(value, this.config.path, []) as T[] : value as T[];
        const itemsWithUniqKey = items?.map(item => {
            if (item['uuidKeyOnCloned'] || item['key'] || item['id']) {
                return item;
            }
            const key = UUID.UUID();
            this.generatedKeys.add(key);
            return {
                ...item,
                key,
            } as T;
        });
        set(this.entity, this.config.path, itemsWithUniqKey);

        const rawItems = this.config?.buildItemAsNestedKey?.length > 0
            ? [
                {
                    [this.config?.buildItemAsNestedKey]: itemsWithUniqKey,
                } as T,
            ]
            : itemsWithUniqKey;
        this.changeByItems(rawItems, requestData);
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.syncRequest.next(request);

        // Incomplete interface, so convert function to async
        await Promise.resolve();
    }

    public add(item: T): void {
        const {uuidKeyName} = this.config;
        if (uuidKeyName) {
            item[uuidKeyName] = UUID.UUID();
        }

        // Opt-in refetch (see `XmTableArrayCollectionControllerConfig.refetchBeforeSave`). When
        // disabled, `getFreshEntity$()` returns `of(null)`, which emits synchronously, so `add()`
        // keeps its previous synchronous behavior.
        this.pendingAdds++;
        this.getFreshEntity$().pipe(
            filter(Boolean),
            finalize(() => {
                this.pendingAdds--;
                if (this.pendingAdds === 0) {
                    this.flushQueuedSaves();
                }
            }),
        ).subscribe(() => {
            this.hasCompletedAdd = true;
            super.add(item);
        });
    }

    public save(type?: SaveType): void {
        // e.g. clone action calls `add()` and `save()` back to back
        if (this.pendingAdds > 0) {
            this.queuedSaves.push({type});
            return;
        }
        if (!this.config?.path) {
            console.warn('table-array-collection-controller: add "path" property to config');
            return;
        }

        if (this.config?.saveWithType) {
            const itemsFromEntity: Array<T> = get(this.entity, this.config.path) || [];
            const eventType = type || (!this.removedItems.length ? 'ADD' : 'REMOVE');
            const updatedItems = this.getItemsOn(eventType, itemsFromEntity);
            set(this.entity, this.config.path, cloneDeep(updatedItems));
        } else {
            const itemsFromEntity: Array<unknown> = get(this.entity, this.config.path) || [];
            const itemsFromEntityFiltered = itemsFromEntity.filter(item => !this.isDeletedItem(item) && !this.isCurrentItem(item));
            set(this.entity, this.config.path, cloneDeep([...itemsFromEntityFiltered, ...this.items]));
        }

        if (this.config.save?.controller) {
            const saveResult = this.getEntityController(this.config?.save?.controller?.key)[this.config?.save?.controller?.method](this.entity);
            if (isObservable(saveResult)) {
                saveResult.pipe(
                    take(1),
                ).subscribe();
            }
        } else {
            this.getEntityController().update(this.entity);
        }
        this.removedItems = [];
    }

    protected isDeletedItem(item: unknown): boolean {
        return this.removedItems.some(removedItem => isEqual(removedItem, item));
    }

    protected isCurrentItem(item: unknown): boolean {
        return this.items.some(current => isEqual(current, item) || this.isEqualByKeys(current, item as XmTableArrayCollectionItem));
    }

    /**
     * Replays every `save()` deferred while an `add()` was refetching, in call order, so a later
     * save type (e.g. `EDIT`) does not discard an earlier one and the added row is persisted too.
     * Implicit/`ADD` saves are dropped when no deferred `add()` completed (conflict), because the
     * table was already re-synced with the fresh entity.
     */
    private flushQueuedSaves(): void {
        const queued = this.queuedSaves;
        const hasCompletedAdd = this.hasCompletedAdd;
        this.queuedSaves = [];
        this.hasCompletedAdd = false;

        queued
            .filter(({type}) => hasCompletedAdd || (type && type !== 'ADD'))
            .forEach(({type}) => this.save(type));
    }

    public getItemsOn(type: SaveType, itemsFromEntity: T[]): T[] {
        switch (type) {
            case 'ADD':
                return this.getItemsOnAdd(itemsFromEntity);
            case 'EDIT':
                return this.getItemsOnEdit(itemsFromEntity);
            case 'REMOVE':
                return this.getItemsOnRemove(itemsFromEntity);
            default:
                return [...itemsFromEntity];
        }
    }

    private getItemsOnAdd(itemsFromEntity: T[]): T[] {
        const newItems = this.items.filter(item => !itemsFromEntity.some(entity => {
            return isEqual(item, entity)
                || this.isEqualByKeys(item as XmTableArrayCollectionItem, entity as XmTableArrayCollectionItem);
        }));
        return [...itemsFromEntity, ...newItems];
    }

    private getItemsOnEdit(itemsFromEntity: T[]): T[] {
        const editedItemIndexInEntity = itemsFromEntity.findIndex(entity => {
            return this.items.some(item => this.isEqualByKeys(item, entity) && !isEqual(entity, item));
        });
        const editedItem = this.items.find(item => this.isEqualByKeys(item, itemsFromEntity[editedItemIndexInEntity]));
        const startItems = itemsFromEntity.slice(0, editedItemIndexInEntity);
        const endItems = itemsFromEntity.slice(editedItemIndexInEntity + 1);
        return [...startItems, editedItem, ...endItems];
    }

    private getItemsOnRemove(itemsFromEntity: T[]): T[] {
        return itemsFromEntity.filter(item => {
            return !this.removedItems.some(removedItem => this.isEqualByKeys(item, removedItem) || isEqual(removedItem, item));
        });
    }

    private getEntityController(key: string = this.config?.entityController?.key || 'table-entity-controller'): XmTableEntityController<object> | any {
        return this.xmDynamicInstanceService.getControllerByKey(
            key,
            this.injector,
        ) || this.entityController;
    }

    public remove(item: T, options?: XmTableArrayCollectionControllerConfig, hideDialog?: boolean): void {
        if (hideDialog) {
            this.removedItems.push(item);
            super.remove(item);
            return;
        }
        this.alert.delete(options).pipe(
            take(1),
            filter((i) => i.value),
            switchMap(() => this.getFreshEntity$()),
            filter(Boolean),
        ).subscribe(() => {
            this.removedItems.push(item);
            super.remove(item);
        });
    }

    /**
     * Opt-in refetch (see `XmTableArrayCollectionControllerConfig.refetchBeforeSave`): pulls the
     * freshest entity from the bound entity controller and stores it on `this.entity`, so the
     * following `save()` builds the updated `path` array on top of up-to-date data instead of a
     * possibly stale value captured by the persistent `entity$()` subscription.
     *
     * Emits `true` when the caller may proceed. Emits `false` on an identity conflict (see
     * `reconcileFreshEntity()`): the table is then re-synced with the fresh data and the user is
     * asked to retry, instead of saving with ambiguous row identities.
     */
    private getFreshEntity$(): Observable<boolean> {
        if (!this.config?.refetchBeforeSave) {
            return of(true);
        }

        const controller = this.getEntityController() as Record<string, () => Observable<unknown>>;
        const getFresh = controller?.['getFresh$'];

        if (!isFunction(getFresh)) {
            return of(true);
        }

        return getFresh.call(controller).pipe(
            take(1),
            map((freshEntity) => {
                if (!freshEntity) {
                    return true;
                }
                const {entity, conflict, generatedKeys} = this.reconcileFreshEntity(freshEntity as object);
                if (conflict) {
                    this.removedItems = [];
                    this.applyEntity(freshEntity as object, this._lastRequest);
                    this.toaster.create({type: 'warning', text: 'error.concurrencyFailure'}).subscribe();
                    return false;
                }
                this.entity = entity;
                if (generatedKeys) {
                    this.generatedKeys = generatedKeys;
                }
                return true;
            }),
            // Fall back to the local entity so add()/remove() still proceed.
            defaultIfEmpty(true),
            catchError((error: unknown) => {
                console.warn('table-array-collection-controller: refetch before save failed, using local entity', error);
                return of(true);
            }),
        );
    }

    /**
     * Gives keyless fresh rows the same generated `key` their local counterparts got in
     * `applyEntity()` (matched by content), so `save()` can match removed/current rows by identity.
     *
     * Keyless rows have no server-side identity, so a row whose content changed on the backend
     * cannot be matched. If a locally keyed row is left unmatched while a fresh keyless row is
     * unmatched too, the identities are ambiguous and a `conflict` is reported.
     */
    private reconcileFreshEntity(freshEntity: object): {entity: object; conflict: boolean; generatedKeys?: Set<string>} {
        if (!this.config?.path) {
            return {entity: freshEntity, conflict: false};
        }

        const localItems = (get(this.entity, this.config.path) || []) as XmTableArrayCollectionItem[];
        const usedKeys = new Set<string>();
        let hasUnmatchedFresh = false;
        const freshItems = (get(freshEntity, this.config.path) || []) as XmTableArrayCollectionItem[];

        const reconciled = freshItems.map((item) => {
            if (item?.uuidKeyOnCloned || item?.['key'] || item?.id) {
                return item;
            }
            const match = localItems.find((local) => {
                const key = local?.['key'];
                return key && !usedKeys.has(key) && isEqual(omit(local, 'key'), item);
            });
            if (!match) {
                hasUnmatchedFresh = true;
            }
            const key = match?.['key'] || UUID.UUID();
            usedKeys.add(key);
            return {...item, key};
        });

        const hasUnmatchedLocal = localItems.some((local) => {
            const key = local?.['key'];
            return this.generatedKeys.has(key) && !usedKeys.has(key);
        });

        if (hasUnmatchedFresh && hasUnmatchedLocal) {
            return {entity: freshEntity, conflict: true};
        }

        set(freshEntity, this.config.path, reconciled);
        return {entity: freshEntity, conflict: false, generatedKeys: usedKeys};
    }

    public edit(item: T, newItem: T): void {
        super.edit(item, newItem);
        this.getFreshEntity$().pipe(filter(Boolean)).subscribe(() => this.save('EDIT'));
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private isEqualByKeys(obj1: XmTableArrayCollectionItem = {}, obj2: XmTableArrayCollectionItem = {}, keysArray = ['key', 'id']): boolean {
        if (obj1['uuidKeyOnCloned'] || obj2['uuidKeyOnCloned']) {
            return obj1['uuidKeyOnCloned'] === obj2['uuidKeyOnCloned'];
        }

        return keysArray.some(key => {
            return obj1[key] != null && obj1[key] === obj2[key];
        });
    };
}
