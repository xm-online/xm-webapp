import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import {
    FilterQueryParams,
    IXmTableCollectionController,
} from './i-xm-table-collection-controller';
import {
    XmTableConfigController,
} from '../config/xm-table-config-controller.service';
import { firstValueFrom
} from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';
import {
    XmTableEntityController,
} from '../entity/xm-table-entity-controller.service';
import { cloneDeep, get, set } from 'lodash';

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

    public async load(request: FilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
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
