import { Injectable } from '@angular/core';

import { XmEntity } from '@xm-ngx/entity';
import * as _ from 'lodash';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { cloneDeep, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';
import { XmTableArrayCollectionControllerConfig } from './xm-table-array-collection-controller';

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

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
        this.entity = await firstValueFrom(this.entityController.entity$());
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
