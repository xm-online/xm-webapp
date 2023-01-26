import { Injectable } from '@angular/core';
import {
    IXmTableCollectionController,
    XmTableArrayCollectionController,
    XmTableAtTypeCollectionController,
    XmTableConfigCollectionController,
    XmTableConfigController,
    XmTableLinkedCollectionController,
    XmTableReadOnlyArrayCollectionController,
    XmTableRepositoryCollectionController,
    XmTableStringArrayCollectionController,
} from '@xm-ngx/components/table/table';
import { lastValueFrom } from 'rxjs';
import {
    XmTableReadOnlyRepositoryCollectionController,
} from '@xm-ngx/components/table/table/controllers/collections/xm-table-read-only-repository-collection-controller';

@Injectable()
export class XmTableCollectionControllerResolver<T> {

    constructor(
        private configController: XmTableConfigController<{ type: string }>,
        private arrayController: XmTableArrayCollectionController<T>,
        private atTypeController: XmTableAtTypeCollectionController<T>,
        private configCollectionController: XmTableConfigCollectionController<T>,
        private linkedController: XmTableLinkedCollectionController<T>,
        private readOnlyArrayController: XmTableReadOnlyArrayCollectionController<T>,
        private repositoryController: XmTableRepositoryCollectionController<T>,
        private readOnlyrepositoryController: XmTableReadOnlyRepositoryCollectionController<T>,
        private stringArrayController: XmTableStringArrayCollectionController<any>,
    ) {
    }

    public async get(): Promise<IXmTableCollectionController<T>> {
        const config = await lastValueFrom(this.configController.config$());
        const collectionType = config.type;

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
                return this.readOnlyrepositoryController;
            case 'link':
                return this.linkedController;
            case 'config':
                return this.configCollectionController;
            default:
                throw new Error('Invalid type' + collectionType);
        }
    }
}
