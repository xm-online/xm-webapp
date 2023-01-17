import { Injectable, OnDestroy } from '@angular/core';
import { QueryParams } from '@xm-ngx/components/entity-collection';
import { PageService } from '@xm-ngx/dashboard';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { assign, cloneDeep, forIn, isEqual, isPlainObject, transform } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PageParamsStore } from '../page-params-store/page-params-store.service';

const cloneDeepWithoutUndefined = (obj) => transform(obj, (r, v, k) => {
    if (v === undefined || v === '' || v === null) {
        return;
    }
    r[k] = isPlainObject(v) ? cloneDeepWithoutUndefined(v) : v;
}, {});

@Injectable()
export class XmRequestBuilderService implements OnDestroy {
    private request$: BehaviorSubject<QueryParams>;

    constructor(private paramsStore: PageParamsStore,
                private pageService: PageService,
    ) {
        this.init();
        this.pageService.active$().pipe(
            filter(Boolean),
            takeUntilOnDestroy(this),
        ).subscribe(() => {
            this.reset();
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        this.reset();
    }

    public update(request: QueryParams): void {
        const oldReq = cloneDeep(this.request$.getValue());
        let newRequest = assign({}, oldReq, request);
        newRequest = cloneDeepWithoutUndefined(newRequest);
        if (isEqual(newRequest, oldReq)) {
            return;
        }
        this.paramsStore.store(newRequest);
        this.request$.next(newRequest);
    }

    public create(): QueryParams {
        const req = {};
        const request = this.request$.getValue();
        forIn(request, (value, key) => {
            if (value instanceof Date) {
                req[key] = value.toISOString();
            } else if (value !== undefined && value !== '' && value !== null) {
                req[key] = value;
            }
        });
        return req;
    }

    public change$(): Observable<QueryParams> {
        return this.request$.asObservable();
    }

    public getCurrentRequest(): QueryParams {
        return this.request$.getValue();
    }

    private init(): void {

        const request = this.paramsStore.get();
        this.request$ = new BehaviorSubject<object>(request);
    }

    private reset() {
        if (this.request$) {
            this.request$.complete();
            delete this.request$;
        }
        this.init();
    }
}
