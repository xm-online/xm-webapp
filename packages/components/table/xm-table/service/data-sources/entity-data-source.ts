import {Injectable} from '@angular/core';
import {TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {Observable} from 'rxjs';
import {ArgumentException} from '@xm-ngx/shared/exceptions';
import {assign, get, join, keys, mapKeys, split} from 'lodash';
import {flattenObject} from '@xm-ngx/shared/operators';
import {RequestBuilderService} from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';
import {map, switchMap} from 'rxjs/operators';
import {XmEntity, XmEntityService} from '@xm-ngx/entity';

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
export class EntityDataSource<T> {
    constructor(private requestBuilder: RequestBuilderService,
                private xmEntityService: XmEntityService) {
    }

    public query(dataSource: TableDatasource): Observable<XmEntity<T>[]> {
        if (!dataSource.options?.typeKey) {
            throw new ArgumentException('Config path dataSource.options.typeKey should be defined!');
        }
        const initialQuery: Partial<unknown> = stringToObj(dataSource.options?.initialQuery);
        const query = {
            typeKey: dataSource.options.typeKey,
            ...initialQuery
        };


        this.requestBuilder.update(query);
        // TODO ?????????????????????????????
        this.requestBuilder.change$().subscribe(console.log);
        return this.requestBuilder.change$().pipe(
            switchMap(query => {
                const stringQuery = queryString(query);
                return this.xmEntityService.search({query: stringQuery});
            }),
            map(res => get(res, 'body')));
    }
}
