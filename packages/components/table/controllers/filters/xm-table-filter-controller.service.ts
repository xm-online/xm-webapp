import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { merge, cloneDeep, isPlainObject, transform } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FiltersControlValue } from '../../components/xm-table-filter-button-dialog-control.component';
import { XmTableInlineFilterFormLayoutItem } from '../../components/xm-table-filter-chips.component';

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
    private filterVisibilitySubject = new Subject<boolean>();
    public filterVisibility$ = this.filterVisibilitySubject.asObservable();

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

    public clearExceptFixedFilters(filters: XmTableInlineFilterFormLayoutItem[]): void {
        const cacheFilters = this.get();
        const fixedFilters = (filters ?? [])
            .filter(filter => filter.removable === false)
            .reduce((acc, filter) => {
                return {
                    ...acc,
                    [filter.name]: filter.removable,
                };
            }, {});

        const keepFixedFilters = Object.keys(cacheFilters)
            .filter(key => fixedFilters[key] === false)
            .reduce((acc, key) => {
                return {
                    ...acc,
                    [key]: cacheFilters[key],
                };
            }, {});

        this.set(keepFixedFilters as T);
    }

    public update(request: T): void {
        const oldReq = cloneDeep(this.request$.getValue());
        const newReq = cloneDeep(request);

        let newRequest = merge({}, oldReq, newReq);
        newRequest = cloneDeepWithoutUndefined(newRequest) as T;
        this.request$.next(newRequest);
    }

    public refresh(): void {
        this.request$.next(cloneDeep(this.get()));
    }

    public change$(): Observable<T> {
        return this.request$.asObservable();
    }

    public get(): T {
        return this.request$.getValue();
    }

    public toggleFilterVisibility(isVisible: boolean): void {
        this.filterVisibilitySubject.next(isVisible);
    }
}
