import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import {
    IXmTableCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/i-xm-table-collection-controller';
import {
    XmTableConfigController,
} from '@xm-ngx/components/table/table/controllers/config/xm-table-config-controller.service';
import { lastValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/a-xm-table-local-pageable-collection-controller.service';
import {
    XmTableEntityController,
} from '@xm-ngx/components/table/table/controllers/entity/xm-table-entity-controller.service';
import { cloneDeep, get, set } from 'lodash';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

export interface XmTableArrayCollectionControllerConfig {
    path: string;
    // Make one item of arrays work with table-array selector (search and display)
    buildItemAsNestedKey?: string;
    uuidKeyName?: string;
}

@Injectable()
export class XmTableArrayCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    private config: XmTableArrayCollectionControllerConfig;
    private entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableArrayCollectionControllerConfig>,
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = await lastValueFrom(this.configController.config$());
        this.entity = await lastValueFrom(this.entityController.entity$());
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
