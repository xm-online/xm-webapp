import { Injectable, OnDestroy } from '@angular/core';
import { XmLogger, XmLoggerService } from '@xm-ngx/logger';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PageService } from './page/page.service';

export enum PageChangesStoreType {
    /** when a new page init */
    PRISTINE = 'PRISTINE',
    /** User has made some changes but hasn't saved them yet */
    EDIT = 'EDIT',
    /** User has saved changes */
    UPDATED = 'UPDATED',
}

export interface PageChangesStorePayload {
    state: PageChangesStoreType,
}

@Injectable({ providedIn: 'root' })
/**
 * Stores page changes state between widgets
 */
export class PageChangesStore implements OnDestroy {

    private changeStateEvent: Subject<PageChangesStorePayload> = new ReplaySubject(1);
    private state: Observable<PageChangesStorePayload> = this.changeStateEvent.asObservable();
    private logger: XmLogger;

    constructor(
        protected pageService: PageService,
        loggerService: XmLoggerService,
    ) {
        this.logger = loggerService.create({ name: 'PageChangesStore' });

        this.pageService.active$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe(() => {
            this.changeStateEvent.next({ state: PageChangesStoreType.PRISTINE });
            this.logger.debug(`The new page resets state to ${PageChangesStoreType.PRISTINE}.`);
        });
    }

    public state$(): Observable<PageChangesStoreType> {
        return this.state.pipe(
            pluck('state'),
        );
    }

    public setState(state: PageChangesStoreType): void {
        this.changeStateEvent.next({ state });
        this.logger.debug(`State is updated with "${state}".`);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

}
