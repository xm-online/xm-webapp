import { Injectable, Injector, ViewContainerRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
    AXmTableLocalPageableCollectionController,
} from './a-xm-table-local-pageable-collection-controller.service';

import { NotSupportedException } from '@xm-ngx/shared/exceptions';
import { FilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import _ from 'lodash';
import { XmDynamicComponentRegistry } from '@xm-ngx/dynamic';

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
        private dynamicComponents: XmDynamicComponentRegistry,
        private injector: Injector,
        private viewContainerRef: ViewContainerRef,
    ) {
        super();
    }

    public async load(request: FilterQueryParams): Promise<void> {
        this.config = await firstValueFrom(this.configController.config$());
        this.items = _.get(this.config, this.config.path, []) as T[];

        //TODO: check
        const entry = await this.dynamicComponents.find<T>('boards/teams-away-days-widget', this.injector);

        this.viewContainerRef.clear();

        const componentRef = this.viewContainerRef.createComponent(entry.componentType, {
            index: 0,
            ngModuleRef: entry.ngModuleRef,
            injector: entry.injector,
        });

        componentRef.instance;
    }

    public save(): void {
        throw new NotSupportedException();
    }
}
