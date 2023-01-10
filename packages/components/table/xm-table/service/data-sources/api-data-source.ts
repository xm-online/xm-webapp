import { Injectable } from '@angular/core';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { XmRequestBuilderService } from '@xm-ngx/components/table/xm-table/service/xm-request-builder-service/xm-request-builder.service';
import { XmTableDataSource } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { map, Observable, switchMap } from 'rxjs';

@Injectable()
export class ApiDataSource<T> {

    constructor(private requestBuilder: XmRequestBuilderService,
                private entityCollection: EntityCollectionFactoryService) {
    }

    public query(dataSource: XmTableDataSource): Observable<T[]> {
        const tmfService = this.entityCollection.create<T>(dataSource.options.apiPath);
        return this.requestBuilder.change$().pipe(
            switchMap(query => tmfService.query(query)),
            map(res => res?.body));
    }
}
