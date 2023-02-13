import { Injectable, OnDestroy } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { assign, cloneDeep, forIn, isPlainObject, transform } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

const cloneDeepWithoutUndefined = (obj) => transform(obj, (r, v, k) => {
    if (v === undefined || v === '' || v === null) {
        return;
    }
    r[k] = isPlainObject(v) ? cloneDeepWithoutUndefined(v) : v;
}, {});

function jsObjectToQueryParams(request: object): object {
    const req = {};
    forIn(request, (value: any, key) => {
        if (value instanceof Date) {
            req[key] = value.toISOString();
        } else if (value !== undefined && value !== '' && value !== null) {
            req[key] = value;
        }
    });
    return req;
}

@Injectable()
export class XmTableFilterController implements OnDestroy {
    private request$: BehaviorSubject<QueryParams>;


    constructor() {
        this.request$ = new BehaviorSubject<object>({});
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public update(request: QueryParams): void {
        const oldReq = cloneDeep(this.request$.getValue());
        let newRequest = assign({}, oldReq, request);
        newRequest = cloneDeepWithoutUndefined(newRequest);
        this.request$.next(newRequest);
    }

    public create(): QueryParams {
        const request = this.request$.getValue();
        return jsObjectToQueryParams(request);
    }

    public change$(): Observable<QueryParams> {
        return this.request$.asObservable();
    }

    public getCurrentRequest(): QueryParams {
        return this.request$.getValue();
    }

}
