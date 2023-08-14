import { inject, Injectable } from '@angular/core';
import { injectByKey } from '@xm-ngx/dynamic';
import { XmConfig } from '@xm-ngx/interfaces';
import { UUID } from 'angular2-uuid';
import { cloneDeep, get, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { XmTableEntityController, } from '../entity/xm-table-entity-controller.service';
import { AXmTableLocalPageableCollectionController, } from './a-xm-table-local-pageable-collection-controller.service';
import { IXmTableCollectionController, XmFilterQueryParams, } from './i-xm-table-collection-controller';

export interface XmTableEntity extends XmConfig {
    path: string;
    // Make one item of arrays work with table-array selector (search and display)
    buildItemAsNestedKey?: string;
    uuidKeyName?: string;
}

export interface XmTableArrayCollectionControllerConfig extends XmTableEntity {
    type: 'array'
}

@Injectable()
export class XmTableArrayCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    public config: XmTableArrayCollectionControllerConfig;
    private entity: object;

    private entityController = injectByKey<XmTableEntityController<object>>('table-entity-controller', {optional: true}) || inject<XmTableEntityController<object>>(XmTableEntityController);

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.entityController.entity$());
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
        this.entityController.update(this.entity);
    }
}
