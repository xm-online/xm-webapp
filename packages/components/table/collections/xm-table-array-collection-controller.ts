import { inject, Injectable, Injector } from '@angular/core';
import {
    XmDynamicInstanceService
} from '@xm-ngx/dynamic';
import { XmConfig } from '@xm-ngx/interfaces';
import { UUID } from 'angular2-uuid';
import _, { cloneDeep, get, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { XmTableEntityController, } from '../controllers/entity/xm-table-entity-controller.service';
import { AXmTableLocalPageableCollectionController, } from './a-xm-table-local-pageable-collection-controller.service';
import { IXmTableCollectionController, XmFilterQueryParams, } from './i-xm-table-collection-controller';
import { XmToasterService } from '@xm-ngx/toaster';
import { XmAlertService } from '@xm-ngx/alert';
import { filter, take } from 'rxjs/operators';

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
    },
}

@Injectable()
export class XmTableArrayCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    public declare config: XmTableArrayCollectionControllerConfig;
    private entity: object;

    private entityController = inject<XmTableEntityController<object>>(XmTableEntityController, {optional: true});
    protected toaster: XmToasterService = inject(XmToasterService);
    protected alert: XmAlertService = inject(XmAlertService);
    private xmDynamicInstanceService: XmDynamicInstanceService = inject(XmDynamicInstanceService);
    private injector: Injector = inject(Injector);

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.getEntityController().entity$());

        const pathList = get(this.entity, this.config.path, []) as T[];

        // TODO: provide default value
        this.items = this.config.buildItemAsNestedKey?.length > 0
            ? [{ [this.config.buildItemAsNestedKey]: pathList } as T]
            : pathList;
    }

    public add(item: T): void {
        const { uuidKeyName } = this.config;
        if (uuidKeyName) {
            item[uuidKeyName] = UUID.UUID();
        }

        super.add(item);
    }

    public save(): void {
        set(this.entity, this.config.path, cloneDeep(this.items));
        this.getEntityController().update(this.entity);
    }

    private getEntityController(): XmTableEntityController<object> {
        return this.xmDynamicInstanceService.getControllerByKey(
            this.config?.entityController?.key || 'table-entity-controller',
            this.injector
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
}
