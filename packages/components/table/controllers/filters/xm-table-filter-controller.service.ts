import { Injectable, OnDestroy } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { assign, cloneDeep, isPlainObject, transform } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

function cloneDeepWithoutUndefined(obj) {
    return transform(obj, (r, v, k) => {
        if (v === undefined || v === '' || v === null) {
            return;
        }
        r[k] = isPlainObject(v) ? cloneDeepWithoutUndefined(v) : v;
    }, {});
}

@Injectable()
export class XmTableFilterController<T extends QueryParams = QueryParams> implements OnDestroy {
    private request$: BehaviorSubject<T>;

    constructor() {
        this.request$ = new BehaviorSubject<T>({} as T);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public update(request: T): void {
        const oldReq = cloneDeep(this.request$.getValue());
        let newRequest = assign({}, oldReq, request);
        newRequest = cloneDeepWithoutUndefined(newRequest) as T;
        this.request$.next(newRequest);
    }

    public change$(): Observable<T> {
        return this.request$.asObservable();
    }

    public get(): T {
        return this.request$.getValue();
    }
}
