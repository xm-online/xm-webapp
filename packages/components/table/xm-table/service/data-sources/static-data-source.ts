import {Injectable} from '@angular/core';
import {XmTableDataSource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {Observable, of} from 'rxjs';

@Injectable()
export class StaticDataSource<T> {

    public query(dataSource: XmTableDataSource): Observable<T[]> {
        return of(dataSource.options?.data || []);
    }
}
