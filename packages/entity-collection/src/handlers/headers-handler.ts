import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IId, QueryParams } from '../models';
import { AHttpRestHandler } from './a-http-rest-handler';

export type Extra = { xTotalCount: number } | any;

export const X_TOTAL_HEADER = 'X-Total-Count';

export class HeadersHandler<T extends IId> extends AHttpRestHandler<T> {

    public query(params: QueryParams): Observable<HttpResponse<T[] & Extra>> {
        return super.query(params).pipe(
            map((res) => {
                const body: T[] & Extra = res.body;
                body.xTotalCount = parseInt(res.headers.get(X_TOTAL_HEADER), 10);
                return res;
            }),
        );
    }

}
