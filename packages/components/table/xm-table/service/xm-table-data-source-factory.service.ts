import {Injectable} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {EntityCollectionFactoryService} from '@xm-ngx/components/entity-collection';
import {DataSourceAdapter, TableDataSourceI} from '@xm-ngx/components/table/xm-table/service/data-source-adapter';
import {TableDataSource} from '@xm-ngx/components/table/xm-table/service/xm-table-data-source';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {ArgumentException} from '@xm-ngx/shared/exceptions';
import {get} from 'lodash';
import {Observable} from 'rxjs';
import {TableFilterService} from '@xm-ngx/components/table/xm-table/service/table-filter.service';

export interface XmTableDataSource<T> extends MatTableDataSource<T> {
    loading$?: Observable<boolean>;
}


@Injectable({
    providedIn: 'root',
})
export class XmTableDataSourceFactoryService<T> {

    constructor(private entityCollection: EntityCollectionFactoryService,
                private tableFilter: TableFilterService
    ) {
    }

    public getDataSource(dataSource: TableDatasource): TableDataSourceI<T> {

        switch (dataSource?.type) {

            case 'STATIC':
                const data: any = new MatTableDataSource(dataSource?.options?.data || []);
                data.sortingDataAccessor = (item, property) => get(item, property);
                data.filterPredicate = (data: T, filter: Record<any, any> = {}) => {
                    if (!filter) {
                        return true;
                    }
                    let filtered = false;
                    for (const key in filter) {
                        if (key) {
                            const curr = get(data, key)?.trim()?.toLowerCase();
                            const filteredData = filter[key]?.trim()?.toLowerCase();
                            if (curr?.includes(filteredData)) {
                                filtered = true;
                            }
                        }
                    }
                    return filtered;
                };
                this.tableFilter.filters().subscribe(query => data.filter = query);
                return data;

            case 'OBJECT':
                let pathData;
                // this.pageEntityService.entity$()
                //     .subscribe(entity => {
                //             const currentArray = get(entity, dataSource.options?.path);
                //             pathData = new MatTableDataSource(currentArray);
                //             pathData.sortingDataAccessor = (item, property) => get(item, property);
                //         },
                //     );

                return new DataSourceAdapter(pathData);

            case 'ENTITY':
                const serv = this.entityCollection.create('entity/api/xm-entities');
                const entityDataSource = new TableDataSource(serv);
                entityDataSource.filter = {typeKey: dataSource.options.typeKey};
                return entityDataSource;

            case 'TMF-API':
                return new MatTableDataSource([]);

            case 'API':
                return new MatTableDataSource([]);
            default:
                throw new ArgumentException('Table DataSource type do not support!');
        }

    }
}

