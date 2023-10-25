import { Injectable } from '@angular/core';
import { NotSupportedException } from '@xm-ngx/exceptions';

import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';
import { get } from 'lodash';
import { XmTableEntityController } from '../controllers/entity/xm-table-entity-controller.service';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableEntity } from './xm-table-array-collection-controller';

export interface XmTableReadOnlyArrayCollectionControllerConfig extends XmTableEntity {
    type: 'readOnlyArray'
}

@Injectable()
export class XmTableReadOnlyArrayCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {

    public add(): void {
        throw new NotSupportedException();
    }

    public edit(): void {
        throw new NotSupportedException();
    }

    public declare config: XmTableReadOnlyArrayCollectionControllerConfig;
    private entity: object;

    constructor(
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.entity = await firstValueFrom(this.entityController.entity$());
        this.items = get(this.entity, this.config.path, []) as T[];
    }

    public remove(): void {
        throw new NotSupportedException();
    }

    public reset(): void {
        throw new NotSupportedException();
    }

    public save(): void {
        throw new NotSupportedException();
    }

    public change(): void {
        throw new NotSupportedException();
    }
}

