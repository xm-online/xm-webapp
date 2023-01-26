import { Provider } from '@angular/core';
import { XmTableConfigController } from './config/xm-table-config-controller.service';
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
import { XmTableEntityRepository } from '../repositories/xm-table-entity-repository';
import {
    XmTableReadOnlyRepositoryCollectionController
} from './collections/xm-table-read-only-repository-collection-controller';

export const XM_TABLE_CONTROLLERS: Provider[] = [
    XmTableEntityRepository,
    XmTableRepositoryResolver,

    XmTableConfigController,
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
];
