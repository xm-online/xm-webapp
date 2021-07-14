import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from '@angular/router';
import { IId } from '@xm-ngx/shared/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {
        this.init();
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public getQueryParams(): PageEntityParams | null {
        const queryParams = { ...this.activatedRoute.snapshot.queryParams };
        return getId(queryParams);
    }

    /**
     * Return a thread on the queryParams and complete it when the page changes
     */
    public changePerPage$(): Observable<PageEntityParams> {
        return this.change.pipe(
            takeUntil(
                this.router.events.pipe(filter(e => e instanceof NavigationStart)),
            ),
        );
    }

    private init(): void {
        this.change = new BehaviorSubject<PageEntityParams>(this.getQueryParams());
        this.activatedRoute.queryParams
            .pipe(takeUntilOnDestroy(this))
            .subscribe((res) => this.change.next(getId(res)));
    }
}
