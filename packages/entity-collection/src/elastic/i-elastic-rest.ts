import { RequestParams } from '@elastic/elasticsearch';
import { Observable } from 'rxjs';
import { IEntityCollection } from '../entity-collection/i-entity-collection';
import { IId } from '../models';

export interface IElasticRestEntity<T extends IId> extends IEntityCollection<T> {

    /** GET request. Use to get specific entities matched by request params. */
    search(params: RequestParams.Index): Observable<T[]>;

}
