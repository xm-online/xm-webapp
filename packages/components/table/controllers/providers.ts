import { Provider } from '@angular/core';
import { XmTableArrayCollectionController } from './collections/xm-table-array-collection-controller';
import { XmTableReadOnlyArrayCollectionController } from './collections/xm-table-read-only-array-collection-controller.service';
import { XmTableEntityController } from './entity/xm-table-entity-controller.service';
import { XmTableAtTypeCollectionController } from './collections/xm-table-at-type-collection-controller';
import { XmTableLinkedCollectionController } from './collections/xm-table-linked-collection-controller';
import { XmTableStringArrayCollectionController } from './collections/xm-table-string-array-collection-controller.service';
import { XmTableRepositoryCollectionController } from './collections/xm-table-repository-collection-controller.service';
import { XmTableConfigCollectionController } from './collections/xm-table-config-collection-controller.service';
import {
    XmTableCollectionControllerResolver
} from './collections/xm-table-collection-controller-resolver.service';
import {
    XmTableRepositoryResolver
} from '../repositories/xm-table-repository-resolver.service';
import { XmEntityRepository } from '../repositories/xm-entity-repository.service';
import {
    XmTableReadOnlyRepositoryCollectionController
} from './collections/xm-table-read-only-repository-collection-controller';
import { XmTableElasticSearchCollectionController } from '../controllers/elastic/xm-table-elastic-search-collection-controller.service';
import {
    XmElasticSearchRepository
} from '../controllers/elastic/xm-elastic-search-repository.service';
import {
    XmElasticRequestBuilder
} from './elastic/xm-elastic-request-builder.service';

export const XM_TABLE_CONTROLLERS: Provider[] = [
    XmEntityRepository,
    XmElasticSearchRepository,
    XmTableRepositoryResolver,

    XmTableEntityController,

    XmTableCollectionControllerResolver,

    XmTableArrayCollectionController,
    XmTableAtTypeCollectionController,
    XmTableConfigCollectionController,
    XmTableLinkedCollectionController,
    XmTableReadOnlyArrayCollectionController,
    XmTableReadOnlyRepositoryCollectionController,
    XmTableRepositoryCollectionController,
    XmTableStringArrayCollectionController,
    XmTableElasticSearchCollectionController,

    XmElasticRequestBuilder,
];
