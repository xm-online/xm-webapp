import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { assign, cloneDeep, isPlainObject, transform } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiltersControlValue } from '../../components/xm-table-filters-control.component';

function cloneDeepWithoutUndefined(obj) {
    return transform(obj, (r, v, k) => {
        if (v === undefined || v === '' || v === null) {
            return;
        }
        r[k] = isPlainObject(v) ? cloneDeepWithoutUndefined(v) : v;
    }, {});
}

@Injectable()
export class XmTableFilterController<T extends FiltersControlValue = FiltersControlValue> implements OnDestroy {
    private request$: BehaviorSubject<T>;

    constructor() {
        this.request$ = new BehaviorSubject<T>({} as T);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public set(request: T): void {
        const newRequest = cloneDeepWithoutUndefined(request) as T;
        this.request$.next(newRequest);
    }

    public update(request: T): void {
        const oldReq = cloneDeep(this.request$.getValue());
        let newRequest = assign({}, oldReq, cloneDeep(request));
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
