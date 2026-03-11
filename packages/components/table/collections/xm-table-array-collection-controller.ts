import { inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { XmDynamicInstanceService } from '@xm-ngx/dynamic';
import { XmConfig } from '@xm-ngx/interfaces';
import { UUID } from 'angular2-uuid';
import { cloneDeep, get, isEqual, isFunction, set } from 'lodash';
import { filter, isObservable, Observable, of, Subject, switchMap, take, tap } from 'rxjs';
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
    saveWithType?: boolean;
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

    constructor() {
        super();

        this.syncRequest.asObservable().pipe(
            switchMap((requestData: XmFilterQueryParams) => {
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
                    tap((value) => {
                        this.entity = value;

                        const items = this.config?.path ? get(value, this.config.path, []) as T[] : value as T[];

                        const rawItems = this.config?.buildItemAsNestedKey?.length > 0
                            ? [
                                {
                                    [this.config?.buildItemAsNestedKey]: items,
                                } as T,
                            ]
                            : items;
                        this.changeByItems(rawItems, requestData);
                    }),
                );
            }),
            takeUntilOnDestroy(this),
        ).subscribe();
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

        super.add(item);
    }

    public save(type?: SaveType): void {
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
        return this.items.some(removedItem => isEqual(removedItem, item));
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
        const newItems = this.items.filter(item => !itemsFromEntity.some(entity => isEqual(item, entity)));
        return [...itemsFromEntity, ...newItems];
    }

    private getItemsOnEdit(itemsFromEntity: T[]): T[] {
        debugger;
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
        ).subscribe(() => {
            this.removedItems.push(item);
            super.remove(item);
        });
    }

    public edit(item: T, newItem: T): void {
        super.edit(item, newItem);
        this.save('EDIT');
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    private isEqualByKeys(obj1: XmTableArrayCollectionItem, obj2: XmTableArrayCollectionItem, keysArray = ['key', 'id']): boolean {
        if (obj1['uuidKeyOnCloned'] || obj2['uuidKeyOnCloned']) {
            return obj1['uuidKeyOnCloned'] === obj2['uuidKeyOnCloned'];
        }

        return keysArray.some(key => {
            return obj1[key] != null && obj1[key] === obj2[key];
        });
    };
}
