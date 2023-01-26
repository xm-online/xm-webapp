import { Injectable } from '@angular/core';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import {
    IXmTableCollectionController,
    XmTableConfigController,
    XmTableEntityController,
} from '@xm-ngx/components/table/table';
import {
    XmTableArrayCollectionControllerConfig,
} from '@xm-ngx/components/table/table/controllers/collections/xm-table-array-collection-controller';
import { lastValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/a-xm-table-local-pageable-collection-controller.service';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { get } from 'lodash';

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

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = await lastValueFrom(this.configController.config$());
        this.entity = await lastValueFrom(this.entityController.entity$());
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

