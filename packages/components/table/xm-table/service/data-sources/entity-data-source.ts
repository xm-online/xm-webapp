import { Injectable } from '@angular/core';
import { XmTableDataSourceI } from '@xm-ngx/components/table/xm-table/service/xm-table-data-service/xm-table-data-loader.service';
import { XmTableDataSource } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { XmEntity, XmEntityService } from '@xm-ngx/entity';
import { ArgumentException } from '@xm-ngx/shared/exceptions';
import { flattenObject } from '@xm-ngx/shared/operators';
import { assign, get, join, keys, mapKeys, split } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const stringToObj = (query) => {
    if (!query) return null;
    const queryStringArr = split(query, ',').map(el => {
        const prop = el.split(':');
        return { [`${prop[0]}`]: prop[1] };
    });
    return assign({}, ...queryStringArr);
};

const queryString = (query: {[key: string]: string} | string): string => {
    if (typeof query === 'string') {
        return query;
    }
    const queries = flattenObject(query);
    const parts = keys(mapKeys(queries, (value, key) => key + ': ' + value));
    return join(parts, ' AND ');
};

@Injectable()
export class EntityDataSource<T> implements XmTableDataSourceI<XmEntity<T>> {

    constructor(private xmEntityService: XmEntityService) {
    }

    public get loading$(): Observable<boolean> {
        return this.xmEntityService.loading$.asObservable();
    }

    public getAll(query, config: XmTableDataSource): Observable<XmEntity<T>[]> {

        if (!config.options?.typeKey) {
            throw new ArgumentException('Config path dataSource.options.typeKey should be defined!');
        }
        const convertQuery = (req) => {
            const { active, direction, pageIndex, pageSize, length, previousPageIndex, ...rest } = req;
            let sort, page, size;

            if (active && direction) sort = [`${active},${direction}`];
            if (pageIndex != undefined) page = pageIndex;
            if (pageSize != undefined) size = pageSize;

            const initialQuery: Partial<unknown> = stringToObj(config.options?.initialQuery);
            const query = {
                typeKey: config.options.typeKey,
                ...initialQuery,
                ...rest,
            };

            const stringQuery = queryString(query);
            return { query: stringQuery, sort, page, size };
        };

        const req = convertQuery(query);

        return this.xmEntityService.search(req).pipe(
            map(res => get(res, 'body')),
        );
    }

}
