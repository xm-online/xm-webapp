import { Injectable } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { Observable } from 'rxjs';
import { XmTableDataSource } from '../../xm-table.model';

@Injectable()
export class ObjectDataSource<T> {

    public query(query: QueryParams, dataSource: XmTableDataSource): Observable<T[]> {
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
