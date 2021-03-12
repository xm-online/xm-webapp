import { Injectable, OnDestroy } from '@angular/core';
import { XmLogger } from '@xm-ngx/logger';
import { Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DashboardWrapperService } from '../shared/dashboard-wrapper.service';
import { DashboardWidget } from '../shared/widget.model';

export interface Page<C = unknown, L = unknown> {
    id?: number;
    name?: string;
    owner?: string;
    typeKey?: string;
    layout?: L;
    config?: C;
    isPublic?: boolean;
    widgets?: DashboardWidget[];
}

@Injectable({
    providedIn: 'root',
})
export class PageService<T extends Page = Page> implements OnDestroy {

    private _active$: ReplaySubject<T | null> = new ReplaySubject(1);

    constructor(
        private dashboard: DashboardWrapperService,
        protected logger: XmLogger,
    ) {
    }

    public active$(): Observable<T | null> {
        return this._active$.asObservable();
    }

    public load(idOrSlug: string | null): void {
        this.logger.debug(`PageService load ${idOrSlug}.`);
        this.loadPage(idOrSlug);
    }

    public ngOnDestroy(): void {
        this._active$.complete();
        delete this._active$;
    }

    private loadPage(idOrSlug: string | null): void {
        if (idOrSlug) {
            this.dashboard.getByIdOrSlug(idOrSlug)
                .pipe(take(1))
                .subscribe((i) => this._active$.next(i as T));
        } else {
            this._active$.next(null);
        }
    }

}
