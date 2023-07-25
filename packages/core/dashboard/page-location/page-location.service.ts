import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { IId } from '@xm-ngx/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/operators';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';

interface PageEntityParams extends Params, IId {
}

function getId(queryParams: IId): PageEntityParams | null {
    return queryParams.id ? { id: queryParams.id } : null;
}

@Injectable({
    providedIn: 'root',
})
export class PageLocationService implements OnDestroy {

    private change: BehaviorSubject<PageEntityParams>;

    constructor(private activatedRoute: ActivatedRoute) {
        this.init();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getParams(): PageEntityParams | null {
        let route = this.activatedRoute.snapshot.root;

        const routes: ActivatedRouteSnapshot[] = [route];

        while ((route = route.firstChild)) {
            routes.push(route);
        }

        // TODO: (yaroslav) careful, nested params will be override
        const params = Object.assign({}, ...routes.map(route => route.params));

        return getId(params);
    }

    public getQueryParams(): PageEntityParams | null {
        const queryParams = { ...this.activatedRoute.snapshot.queryParams };

        return getId(queryParams);
    }

    /**
     * Prefer query params for page details, but also support basic segment params
     */
    public getPageParams(): PageEntityParams | null {
        const queryParamsEntity = this.getQueryParams();
        const paramsEntity = this.getParams();

        return queryParamsEntity || paramsEntity;
    }

    /**
     * Return a thread on the queryParams and complete it when the page changes
     */
    public changePerPage$(): Observable<PageEntityParams> {
        return this.change.asObservable();
    }

    private init(): void {
        this.change = new BehaviorSubject<PageEntityParams>(this.getPageParams());

        combineLatest([this.activatedRoute.queryParams, this.activatedRoute.params])
            .pipe(takeUntilOnDestroy(this))
            .subscribe((_) => this.change.next(this.getPageParams()));
    }
}
