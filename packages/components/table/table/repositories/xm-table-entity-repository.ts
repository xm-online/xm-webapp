import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientRest, Pageable, QueryParams, QueryParamsPageable } from '@xm-ngx/components/entity-collection';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { XmEntity } from '@xm-ngx/entity';
import { uuid } from '@xm-ngx/shared/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class XmTableEntityRepository<T extends XmEntity, Extra extends Pageable = Pageable>
    extends HttpClientRest<T, Extra> {
    public getAll(params?: QueryParams): Observable<HttpResponse<T[] & Extra>> {
        return super.getAll(this.getParams(params));
    }

    public query(params: QueryParamsPageable): Observable<HttpResponse<T[] & Extra>> {
        return super.query(this.getParams(params));
    }

    public create(entity: T, params?: QueryParams, headers?: HttpHeaders): Observable<HttpResponse<T>> {
        if (entity.key === undefined) {
            entity.key = uuid();
        }
        return super.create(entity, params, headers);
    }

    protected getParams(params: QueryParamsPageable): QueryParamsPageable {
        const request: QueryParamsPageable & { page?: number, size?: number } = _.clone(params);
        if (request.pageSize !== undefined) {
            request.size = params.pageSize;
            delete request.pageSize;
        }

        if (request.pageIndex !== undefined) {
            request.page = params.pageIndex;
            delete request.pageIndex;
        }

        return request;
    }

    protected extractExtra(res: HttpResponse<T[]>): HttpResponse<T[] & Extra> {
        const hasNextPage = res.headers.get('x-has-next');
        let totalPageCount = 0;

        if (hasNextPage === 'true') {
            totalPageCount = Infinity;
        } else {
            totalPageCount = null;
        }

        const extra = {
            // TODO: backend implementation
            // pageIndex: res.body.page || 0,
            pageSize: res.body?.length || 0,
            total: totalPageCount || res.headers.get('x-total-count') || res.body?.length || 0,
        } as Extra;

        const items = res.body;
        const body = Object.assign(items, extra);

        return res.clone({ body });
    }

}
