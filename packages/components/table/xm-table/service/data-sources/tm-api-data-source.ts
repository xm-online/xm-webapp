import { Injectable } from '@angular/core';
import { EntityCollectionFactoryService, QueryParams } from '@xm-ngx/components/entity-collection';
import { map, Observable } from 'rxjs';
import { XmTableDataSource } from '../../xm-table.model';

@Injectable()
export class TmfApiDataSource<T> {

    constructor(private entityCollection: EntityCollectionFactoryService) {
    }

    public query(query: QueryParams, dataSource: XmTableDataSource): Observable<T[]> {
        const tmfService = this.entityCollection.create<T>(dataSource.options.apiPath);
        return tmfService.query(query).pipe(
            map(res => res?.body));
    }
}
