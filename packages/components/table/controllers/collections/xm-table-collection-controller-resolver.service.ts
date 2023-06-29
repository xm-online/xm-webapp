import { Injectable } from '@angular/core';

import {
    XmTableReadOnlyRepositoryCollectionController,
    XmTableReadOnlyRepositoryCollectionControllerConfig,
} from './xm-table-read-only-repository-collection-controller';
import { XmTableWidgetConfig } from '../../table-widget/xm-table-widget.config';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { AtTypeListConfig, XmTableAtTypeCollectionController } from './xm-table-at-type-collection-controller';
import {
    XmTableConfigCollectionController,
    XmTableConfigCollectionControllerConfig
} from './xm-table-config-collection-controller.service';
import {
    XmTableReadOnlyArrayCollectionController,
    XmTableReadOnlyArrayCollectionControllerConfig
} from './xm-table-read-only-array-collection-controller.service';
import {
    StringArrayListConfig,
    XmTableStringArrayCollectionController
} from './xm-table-string-array-collection-controller.service';
import {
    XmTableRepositoryCollectionController,
    XmTableRepositoryCollectionControllerConfig
} from './xm-table-repository-collection-controller.service';
import { LinkListConfig, XmTableLinkedCollectionController } from './xm-table-linked-collection-controller';
import {
    XmTableArrayCollectionController,
    XmTableArrayCollectionControllerConfig
} from './xm-table-array-collection-controller';
import { IXmTableCollectionController } from './i-xm-table-collection-controller';
import { firstValueFrom } from 'rxjs';
import {
    XmTableElasticSearchCollectionController,
    XmTableElasticSearchCollectionControllerConfig
} from '@xm-ngx/components/table/controllers/elastic/xm-table-elastic-search-collection-controller.service';

export type XmTableCollectionControllerType = null
    | LinkListConfig
    | XmTableElasticSearchCollectionControllerConfig
    | XmTableArrayCollectionControllerConfig
    | AtTypeListConfig
    | XmTableConfigCollectionControllerConfig
    | StringArrayListConfig
    | XmTableReadOnlyArrayCollectionControllerConfig
    | XmTableRepositoryCollectionControllerConfig
    | XmTableReadOnlyRepositoryCollectionControllerConfig
    ;

@Injectable()
export class XmTableCollectionControllerResolver<T = unknown> {

    constructor(
        private configController: XmTableConfigController<XmTableWidgetConfig>,
        private arrayController: XmTableArrayCollectionController<T>,
        private atTypeController: XmTableAtTypeCollectionController<T>,
        private configCollectionController: XmTableConfigCollectionController<T>,
        private linkedController: XmTableLinkedCollectionController<T>,
        private readOnlyArrayController: XmTableReadOnlyArrayCollectionController<T>,
        private repositoryController: XmTableRepositoryCollectionController<T>,
        private readOnlyRepositoryCollectionController: XmTableReadOnlyRepositoryCollectionController<T>,
        private stringArrayController: XmTableStringArrayCollectionController<any>,
        private elasticSearchCollectionController: XmTableElasticSearchCollectionController<T>
    ) {
    }

    public async get(): Promise<IXmTableCollectionController<T>> {
        const config = await firstValueFrom(this.configController.config$());
        const collectionType = config.collection.type;

        switch (collectionType) {
            case 'array':
                return this.arrayController;
            case 'atType':
                return this.atTypeController;
            case 'stringArray':
                return this.stringArrayController;
            case 'readOnlyArray':
                return this.readOnlyArrayController;
            case 'repository':
                return this.repositoryController;
            case 'readOnlyRepository':
                return this.readOnlyRepositoryCollectionController;
            case 'link':
                return this.linkedController;
            case 'config':
                return this.configCollectionController;
            case 'elasticSearch':
                return this.elasticSearchCollectionController;
            default:
                throw new Error('Invalid type' + collectionType);
        }
    }
}
