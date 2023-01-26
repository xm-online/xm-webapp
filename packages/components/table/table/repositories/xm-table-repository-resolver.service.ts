import { Injectable } from '@angular/core';
import {
    IEntityCollection,
} from '@xm-ngx/components/entity-collection';
import { XmTableEntityRepository } from '@xm-ngx/components/table/table/repositories/xm-table-entity-repository';

@Injectable()
export class XmTableRepositoryResolver<T> {

    constructor(
        private entityRepository: XmTableEntityRepository<T>,
    ) {
    }

    public get(collectionType: string): IEntityCollection<T> {
        switch (collectionType) {
            case 'xm-entity':
                return this.entityRepository;
            default:
                throw new Error('Invalid type' + collectionType);
        }
    }
}
