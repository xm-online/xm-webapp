import { Injectable } from '@angular/core';
import { NotSupportedException } from '@xm-ngx/exceptions';

import {
    XmTableArrayCollectionControllerConfig,
} from './xm-table-array-collection-controller';
import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';
import { get } from 'lodash';
import { XmTableEntityController } from '../entity/xm-table-entity-controller.service';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';

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

    private config: XmTableArrayCollectionControllerConfig;
    private entity: object;

    constructor(
        private configController: XmTableConfigController<XmTableArrayCollectionControllerConfig>,
        private entityController: XmTableEntityController<object>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
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

