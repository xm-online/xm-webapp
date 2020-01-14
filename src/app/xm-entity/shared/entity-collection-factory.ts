import { HttpClient } from '@angular/common/http';
import { EntityCollection } from './entity-collection';

export function entityCollectionFactory(http: HttpClient): EntityCollection {
    const entity: EntityCollection = new EntityCollection(http);
    entity.
}
