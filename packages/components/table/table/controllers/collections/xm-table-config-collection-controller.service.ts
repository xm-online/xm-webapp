import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/a-xm-table-local-pageable-collection-controller.service';
import {
    IXmTableCollectionController,
    XmTableConfigController,
} from '@xm-ngx/components/table/table';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { get } from 'lodash';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';

export interface XmTableConfigCollectionControllerConfig {
    path: string;
}

@Injectable()
export class XmTableConfigCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {

    private config: XmTableConfigCollectionControllerConfig;

    constructor(
        private configController: XmTableConfigController<XmTableConfigCollectionControllerConfig>,
    ) {
        super();
    }

    public async load(pageableAndSortable: PageableAndSortable | null): Promise<void> {
        this.config = await lastValueFrom(this.configController.config$());
        this.items = get(this.config, this.config.path, []) as T[];
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
