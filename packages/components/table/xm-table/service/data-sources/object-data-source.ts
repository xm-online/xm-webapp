import {Injectable} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {Observable} from 'rxjs';

@Injectable()
export class ObjectDataSource<T> {

    public query(dataSource: TableDatasource): Observable<T[]> {
        ///return this.pageEntityService.entity$()
        //     .subscribe(entity => {
        //             const currentArray = get(entity, dataSource.options?.path);
        //             pathData = new MatTableDataSource(currentArray);
        //             pathData.sortingDataAccessor = (item, property) => get(item, property);
        //         },
        //     );
        return null;
    }
}
