import { Injectable } from '@angular/core';
import { XmTableDataSourceI } from '@xm-ngx/components/table/xm-table/service/data-service/data.service';
import { RequestBuilderService } from '@xm-ngx/components/table/xm-table/service/request-builder-service/request-builder.service';
import { TableDatasource } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { XmEntity, XmEntityService } from '@xm-ngx/entity';
import { ArgumentException } from '@xm-ngx/shared/exceptions';
import { flattenObject } from '@xm-ngx/shared/operators';
import { assign, get, join, keys, mapKeys, split } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

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
    private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private requestBuilder: RequestBuilderService,
                private xmEntityService: XmEntityService) {
    }

    public loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    public getAll(config: TableDatasource): Observable<XmEntity<T>[]> {

        if (!config.options?.typeKey) {
            throw new ArgumentException('Config path dataSource.options.typeKey should be defined!');
        }
        const initialQuery: Partial<unknown> = stringToObj(config.options?.initialQuery);
        const query = {
            typeKey: config.options.typeKey,
            ...initialQuery,
        };


        this.requestBuilder.update(query);

        return this.requestBuilder.change$().pipe(
            tap(() => this._loading$.next(true)),
            switchMap(query => {
                const { active, direction, pageIndex, pageSize, length, previousPageIndex, ...rest } = query;
                let sort, page, size;

                if (active && direction) sort = [`${active},${direction}`];
                if (pageIndex != undefined) page = pageIndex;
                if (pageSize != undefined) size = pageSize;

                const stringQuery = queryString(rest);
                return this.xmEntityService.search({ query: stringQuery,sort,page,size });
            }),
            map(res => get(res, 'body')),
            tap(() => this._loading$.next(false)));
    }

}
