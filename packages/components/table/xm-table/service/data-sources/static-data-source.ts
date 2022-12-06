import {Injectable} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {Observable, of} from 'rxjs';

@Injectable()
export class StaticDataSource<T> {

    public query(dataSource: TableDatasource): Observable<T[]> {
        return of(dataSource.options?.data || []);
    }
}
