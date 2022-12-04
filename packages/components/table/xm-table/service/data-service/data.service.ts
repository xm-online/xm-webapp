import {Injectable, NgModuleRef} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {ArgumentException} from '@xm-ngx/shared/exceptions';
import {map, Observable, of} from 'rxjs';
import {EntityCollectionFactoryService} from '@xm-ngx/components/entity-collection';
import {RequestBuilderService} from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';
import {assign, get, join, keys, mapKeys, split} from 'lodash';
import {switchMap} from 'rxjs/operators';
import {flattenObject} from '@xm-ngx/shared/operators';

const stringToObj = (query) => {
    if (!query) return null;
    const queryStringArr = split(query, ',').map(el => {
        const prop = el.split(':');
        return {[`${prop[0]}`]: prop[1]};
    });
    return assign({}, ...queryStringArr);
};

const queryString = (query: { [key: string]: string } | string): string => {
    if (typeof query === 'string') {
        return query;
    }
    const queries = flattenObject(query);
    const parts = keys(mapKeys(queries, (value, key) => key + ': ' + value));
    return join(parts, ' AND ');
}

@Injectable()
export class DataService {
    public dataAccessService;

    constructor(private entityCollection: EntityCollectionFactoryService,
                private requestBuilder: RequestBuilderService,
                private moduleRef: NgModuleRef<unknown>,) {
    }

    public getData(dataSource: TableDatasource): Observable<any[]> {
        this.dataAccessService = this.moduleRef.injector.get(dataSource.type, null);

        switch (dataSource.type) {
            case 'STATIC':
                return of(dataSource.options?.data || []);

            case 'OBJECT':
                // TODO: check requirements and create realization
                // return of(dataSource.options?.path || []);
                return of([]);

            case 'ENTITY':
                if (!dataSource.options?.typeKey) {
                    throw new ArgumentException('Config path dataSource.options.typeKey should be defined!');
                }
                const initialQuery: Partial<any> = stringToObj(dataSource.options?.initialQuery);
                const query = {
                    typeKey: dataSource.options.typeKey,
                    ...initialQuery
                };

                this.requestBuilder.update(query);
                this.requestBuilder.change$().subscribe(console.log);
                return this.requestBuilder.change$().pipe(
                    switchMap(query => {
                        const stringQuery = queryString(query);
                        return this.dataAccessService?.search({query: stringQuery});
                    }),
                    map(res => get(res,'body')));


            case 'TMF-API':
                const tmfService = this.entityCollection.create<any>(dataSource.options.apiPath);
                return tmfService.query({}).pipe(map(res => res?.body));

            case 'API':
                const apiService = this.entityCollection.create<any>(dataSource.options.apiPath);
                return apiService.query({}).pipe(map(res => res?.body));

            default:
                throw new ArgumentException('Table DataSource type do not support!');
        }
    }
}
