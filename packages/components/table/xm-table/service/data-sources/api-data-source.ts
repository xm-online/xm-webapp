import {Injectable} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {map, Observable, switchMap} from 'rxjs';
import {RequestBuilderService} from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';
import {EntityCollectionFactoryService} from '@xm-ngx/components/entity-collection';

@Injectable()
export class ApiDataSource<T> {

    constructor(private requestBuilder: RequestBuilderService,
                private entityCollection: EntityCollectionFactoryService,) {
    }

    public query(dataSource: TableDatasource): Observable<T[]> {
        const tmfService = this.entityCollection.create<T>(dataSource.options.apiPath);
        return this.requestBuilder.change$().pipe(
            switchMap(query => tmfService.query(query)),
            map(res => res?.body));
    }
}
