import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, pluck, shareReplay, switchMap, tap } from 'rxjs/operators';
import { PageService } from './page';

export enum PageChangesStoreType {
    /** when a new page init */
    PRISTINE = 1,
    /** User has made some changes but hasn't saved them yet */
    EDIT,
    /** User has saved changes */
    UPDATED,
}

export interface PageChangesStorePayload {
    state: PageChangesStoreType,
}

@Injectable({ providedIn: 'root' })
/**
 * Stores page changes state between widgets
 */
export class PageChangesStore {

    private changeStateEvent: Subject<PageChangesStorePayload> = new ReplaySubject(1);
    private state: Observable<PageChangesStorePayload>;

    constructor(
        protected pageService: PageService,
    ) {
        this.state = this.pageService.active$().pipe(
            filter(Boolean),
            tap(() => this.changeStateEvent.next({ state: PageChangesStoreType.PRISTINE })),
            switchMap(() => this.changeStateEvent),
        );
    }

    public state$(): Observable<PageChangesStoreType> {
        return this.state.pipe(
            pluck('state'),
            shareReplay(1),
        );
    }

    public setState(state: PageChangesStoreType): void {
        this.changeStateEvent.next({ state });
    }

}
