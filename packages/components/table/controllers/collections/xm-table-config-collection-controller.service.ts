import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { NotSupportedException } from '@xm-ngx/exceptions';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import _ from 'lodash';
import { XmTableWidgetConfig } from '../../table-widget/xm-table-widget.config';

export interface XmTableConfigCollectionControllerConfig {
    type: 'config'
    path: string;
    staticData: unknown[];
}

@Injectable()
export class XmTableConfigCollectionController<T = unknown>
    extends AXmTableLocalPageableCollectionController<T>
    implements IXmTableCollectionController<T> {

    private config: XmTableConfigCollectionControllerConfig;

    constructor(
        private configController: XmTableConfigController<XmTableWidgetConfig>,
    ) {
        super();
    }

    public async load(request: XmFilterQueryParams): Promise<void> {
        this.config = (await firstValueFrom(this.configController.config$())).collection as XmTableConfigCollectionControllerConfig;
        this.items = _.get(this.config, this.config.path, []) as T[];
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
