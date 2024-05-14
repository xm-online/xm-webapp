import {inject, Injectable, Injector, OnDestroy} from '@angular/core';
import {XmDynamicInstanceService,} from '@xm-ngx/dynamic';
import {XmConfig} from '@xm-ngx/interfaces';
import {UUID} from 'angular2-uuid';
import {cloneDeep, get, isFunction, set} from 'lodash';
import {filter, isObservable, Observable, of, Subject, switchMap, take, tap} from 'rxjs';
import {XmTableEntityController} from '../controllers/entity/xm-table-entity-controller.service';
import {AXmTableLocalPageableCollectionController} from './a-xm-table-local-pageable-collection-controller.service';
import {IXmTableCollectionController, XmFilterQueryParams} from './i-xm-table-collection-controller';
import {XmToasterService} from '@xm-ngx/toaster';
import {XmAlertService} from '@xm-ngx/alert';
import {takeUntilOnDestroy, takeUntilOnDestroyDestroy} from '@xm-ngx/operators';

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
}

@Injectable()
export class XmTableArrayCollectionController<T = unknown>
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

                        const items = get(value, this.config.path, []) as T[];

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

    public save(): void {
        if (!this.config?.path) {
            console.warn('table-array-collection-controller: add "path" property to config');
            return;
        }
        set(this.entity, this.config.path, cloneDeep(this.items));

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
    }

    private getEntityController(key: string = this.config?.entityController?.key || 'table-entity-controller'): XmTableEntityController<object> | any {
        return this.xmDynamicInstanceService.getControllerByKey(
            key,
            this.injector,
        ) || this.entityController;
    }

    public remove(item: T, options?: XmTableArrayCollectionControllerConfig): void {
        this.alert.delete(options).pipe(
            take(1),
            filter((i) => i.value),
        ).subscribe(() => {
            super.remove(item);
        });
    }

    public edit(item: T, newItem: T): void {
        super.edit(item, newItem);
        this.save();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
