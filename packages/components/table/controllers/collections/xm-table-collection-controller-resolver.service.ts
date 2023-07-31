import { Injectable } from '@angular/core';

import {
    XmTableReadOnlyRepositoryCollectionController,
    XmTableReadOnlyRepositoryCollectionControllerConfig,
} from './xm-table-read-only-repository-collection-controller';
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
import {
    XmTableElasticSearchCollectionController,
    XmTableElasticSearchCollectionControllerConfig
} from '../elastic/xm-table-elastic-search-collection-controller.service';
import { XmDynamicWithConfig } from '@xm-ngx/dynamic';

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
        private arrayController: XmTableArrayCollectionController<T>,
        private atTypeController: XmTableAtTypeCollectionController<T>,
        private configCollectionController: XmTableConfigCollectionController<T>,
        private linkedController: XmTableLinkedCollectionController<T>,
        private readOnlyArrayController: XmTableReadOnlyArrayCollectionController<T>,
        private repositoryController: XmTableRepositoryCollectionController<T>,
        private readOnlyRepositoryCollectionController: XmTableReadOnlyRepositoryCollectionController<T>,
        private stringArrayController: XmTableStringArrayCollectionController<any>,
        private elasticSearchCollectionController: XmTableElasticSearchCollectionController<T>,
    ) {
    }

    public factory(collectionConfig: XmTableCollectionControllerType): IXmTableCollectionController<T> {
        const collectionController = this.getController(collectionConfig);
        collectionController.config = collectionConfig;
        return collectionController;
    }

    private getController(collectionConfig: XmTableCollectionControllerType): IXmTableCollectionController<T> & XmDynamicWithConfig {
        const collectionType = collectionConfig.type;
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
