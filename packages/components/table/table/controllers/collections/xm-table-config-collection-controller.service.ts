import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { get } from 'lodash';
import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';

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
        this.config = await firstValueFrom(this.configController.config$());
        this.items = get(this.config, this.config.path, []) as T[];
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
