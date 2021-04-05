import { Injectable } from '@angular/core';
import { XmLogger, XmLoggerService } from '@xm-ngx/logger';
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
    private logger: XmLogger;

    constructor(
        protected pageService: PageService,
        loggerService: XmLoggerService,
    ) {
        this.logger = loggerService.create({name: 'PageChangesStore'});
        this.state = this.pageService.active$().pipe(
            filter(Boolean),
            tap(() => this.changeStateEvent.next({ state: PageChangesStoreType.PRISTINE })),
            tap(() => this.logger.debug('State reset.')),
            switchMap(() => this.changeStateEvent),
            shareReplay(1),
        );
    }

    public state$(): Observable<PageChangesStoreType> {
        return this.state.pipe(
            pluck('state'),
        );
    }

    public setState(state: PageChangesStoreType): void {
        this.logger.debug(`State updated with "${state}".`);
        this.changeStateEvent.next({ state });
    }

}
