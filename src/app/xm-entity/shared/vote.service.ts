import { Injectable } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/entity-collection';
import { SERVER_API_URL } from '../../xm.constants';
import { XmEntity } from './xm-entity.model';

@Injectable()
export class VoteService extends EntityCollectionBase<XmEntity> {

    private resourceSearchUrl: string = SERVER_API_URL + 'entity/api/_search/votes';

    constructor(entityCollectionFactoryService: EntityCollectionFactoryService) {
        super(entityCollectionFactoryService.create('votes'));
    }
}
