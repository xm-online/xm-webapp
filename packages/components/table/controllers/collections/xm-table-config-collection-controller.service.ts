import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { FilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import _ from 'lodash';

export interface XmTableConfigCollectionControllerConfig {
    path: string;
    staticData: unknown;
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

    public async load(request: FilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
        this.items = _.get(this.config, this.config.path, []) as T[];
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
