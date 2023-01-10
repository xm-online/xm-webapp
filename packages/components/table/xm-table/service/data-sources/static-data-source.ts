import { Injectable } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { Observable, of } from 'rxjs';
import { XmTableDataSource } from '../../xm-table.model';

@Injectable()
export class StaticDataSource<T> {

    public query(query: QueryParams, dataSource: XmTableDataSource): Observable<T[]> {
        return of(dataSource.options?.data || []);
    }
}
