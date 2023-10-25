import { Injectable } from '@angular/core';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { NotSupportedException } from '@xm-ngx/exceptions';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import _ from 'lodash';
import { XmConfig } from '@xm-ngx/interfaces';

export interface XmTableConfigCollectionControllerConfig extends XmConfig {
    type: 'config'
    path: string;
    staticData: unknown[];
}

@Injectable()
export class XmTableConfigCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {

    public declare config: XmTableConfigCollectionControllerConfig;

    public load(request: XmFilterQueryParams): void {
        const rawData = _.get(this.config, this.config.path, []) as T[];

        this.changeByItems(rawData, request);
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
