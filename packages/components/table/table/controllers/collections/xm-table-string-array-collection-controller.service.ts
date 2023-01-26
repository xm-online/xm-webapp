import { Injectable } from '@angular/core';

import { XmEntity } from '@xm-ngx/entity';
import * as _ from 'lodash';
import {
    AXmTableLocalPageableCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/a-xm-table-local-pageable-collection-controller.service';
import {
    IXmTableCollectionController, XmTableArrayCollectionControllerConfig,
    XmTableConfigController,
    XmTableEntityController,
} from '@xm-ngx/components/table/table';
import { cloneDeep, set } from 'lodash';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { lastValueFrom } from 'rxjs';

interface StringArrayListManagerItem {
    value: string
}

export interface StringArrayListConfig {
    path: string
}

@Injectable()
export class XmTableStringArrayCollectionController<T extends StringArrayListManagerItem = StringArrayListManagerItem>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    public entity: XmEntity;
    public config: StringArrayListConfig;

    constructor(
        private configController: XmTableConfigController<XmTableArrayCollectionControllerConfig>,
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = await lastValueFrom(this.configController.config$());
        this.entity = await lastValueFrom(this.entityController.entity$());
        const primary = _.get(this.entity, this.config.path, []);
        const modify = primary.map((i) => ({ value: i }));
        this.items = modify;
    }

    public save(): void {
        const items = this.items.map((i) => i.value);
        set(this.entity, this.config.path, cloneDeep(items));
        this.entityController.update(this.entity);
    }
}
