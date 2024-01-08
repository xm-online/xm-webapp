import { Injectable } from '@angular/core';

import { XmEntity } from '@xm-ngx/core/entity';
import * as _ from 'lodash';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { cloneDeep, set } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntityController } from '../controllers/entity/xm-table-entity-controller.service';
import { XmConfig } from '@xm-ngx/interfaces';

interface StringArrayListManagerItem {
    value: string
}

export interface StringArrayListConfig extends XmConfig {
    type: 'stringArray'
    path: string
}

@Injectable()
export class XmTableStringArrayCollectionController<T extends StringArrayListManagerItem = StringArrayListManagerItem>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {
    public entity: XmEntity;
    public declare config: StringArrayListConfig;

    constructor(
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.entityController.entity$());
        const primary = _.get(this.entity, this.config.path, []);
        const modify = primary.map((i) => ({ value: i } as T));
        this.items = modify;
    }

    public save(): void {
        const items = this.items.map((i) => i.value);
        set(this.entity, this.config.path, cloneDeep(items));
        this.entityController.update(this.entity);
    }
}
