import { Injectable } from '@angular/core';
import {
    IEntityCollection,
} from '@xm-ngx/components/entity-collection';
import { XmTableEntityRepository } from './xm-table-entity-repository';
import { XmTableElasticSearchRepository } from '@xm-ngx/components/table/controllers/repositories/xm-table-elastic-search-repository';

@Injectable()
export class XmTableRepositoryResolver<T> {
    constructor(
        private entityRepository: XmTableEntityRepository<T>,
        private elasticSearchRepository: XmTableElasticSearchRepository<T>
    ) {
    }

    public get(collectionType: string): IEntityCollection<T> {
        switch (collectionType) {
            case 'xm-entity':
                return this.entityRepository;
            case 'elastic-search':
                return this.elasticSearchRepository;
            default:
                throw new Error('Invalid type' + collectionType);
        }
    }
}
