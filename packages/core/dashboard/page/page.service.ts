import { inject, Injectable, isDevMode, OnDestroy } from '@angular/core';
import { filter, Observable, ReplaySubject } from 'rxjs';
import { DashboardStore } from '../dashboard-store.service';
import { DashboardWidget } from '../models/dashboard-widget.model';
import { AppStore } from '@xm-ngx/ngrx-store';
import { AppStoreSource } from '@xm-ngx/ngrx-store/src/models/app-store.model';
import { take } from 'rxjs/operators';

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
    protected appStore = inject<AppStoreSource>(AppStore);
    protected dashboard: DashboardStore = inject(DashboardStore);
    protected _active$: ReplaySubject<T | null | undefined> = new ReplaySubject(1);

    public active$(): Observable<T | null> {
        return this._active$.asObservable().pipe(filter((page) => page !== undefined));
    }

    public load(idOrSlug: string | null): void {
        isDevMode() && console.info(`Load dashboard idOrSlug="${idOrSlug}".`);
        this.loadPage(idOrSlug);
    }

    public ngOnDestroy(): void {
        this._active$.complete();
        delete this._active$;
    }

    protected loadPage(idOrSlug: string | null): void {
        if (idOrSlug) {
            this.dashboard.getByIdOrSlug(idOrSlug)
                .pipe(take(1))
                .subscribe((i) => {
                    this.appStore.updateDashboard(i);
                    this._active$.next(i as T);
                });
        } else {
            this._active$.next(null);
        }
    }

    public resetActive(): void {
        this._active$.next(undefined);
    }
}
