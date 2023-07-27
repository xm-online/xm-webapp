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
        const collectionType = collectionConfig.type;

        let collectionController: IXmTableCollectionController<T> & XmDynamicWithConfig;
        switch (collectionType) {
            case 'array':
                collectionController = this.arrayController;
                break;
            case 'atType':
                collectionController = this.atTypeController;
                break;
            case 'stringArray':
                collectionController = this.stringArrayController;
                break;
            case 'readOnlyArray':
                collectionController = this.readOnlyArrayController;
                break;
            case 'repository':
                collectionController = this.repositoryController;
                break;
            case 'readOnlyRepository':
                collectionController = this.readOnlyRepositoryCollectionController;
                break;
            case 'link':
                collectionController = this.linkedController;
                break;
            case 'config':
                collectionController = this.configCollectionController;
                break;
            case 'elasticSearch':
                collectionController = this.elasticSearchCollectionController;
                break;
            default:
                throw new Error('Invalid type' + collectionType);
        }

        collectionController.config = collectionConfig;
        return collectionController;
    }

}
