import { Injectable } from '@angular/core';

import {
    XmTableReadOnlyRepositoryCollectionController,
} from './xm-table-read-only-repository-collection-controller';
import { XmTableConfig } from '../../interfaces/xm-table.model';
import { XmTableConfigController } from '../config/xm-table-config-controller.service';
import { XmTableAtTypeCollectionController } from './xm-table-at-type-collection-controller';
import { XmTableConfigCollectionController } from './xm-table-config-collection-controller.service';
import { XmTableReadOnlyArrayCollectionController } from './xm-table-read-only-array-collection-controller.service';
import { XmTableStringArrayCollectionController } from './xm-table-string-array-collection-controller.service';
import { XmTableRepositoryCollectionController } from './xm-table-repository-collection-controller.service';
import { XmTableLinkedCollectionController } from './xm-table-linked-collection-controller';
import { XmTableArrayCollectionController } from './xm-table-array-collection-controller';
import { IXmTableCollectionController } from './i-xm-table-collection-controller';
import { firstValueFrom } from 'rxjs';
import { XmTableElasticSearchCollectionController } from '@xm-ngx/components/table/controllers/elastic/xm-table-elastic-search-collection-controller.service';

@Injectable()
export class XmTableCollectionControllerResolver<T = unknown> {

    constructor(
        private configController: XmTableConfigController<XmTableConfig>,
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
            case 'readOnlyAArray':
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
