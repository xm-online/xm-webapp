import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { XmAlertResult, XmAlertService } from '@xm-ngx/alert';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { PageChangesStore, PageChangesStoreType } from './page-changes-store';

@Injectable()
export class PendingChangesGuard implements CanDeactivate<unknown> {
    constructor(
        private pageStore: PageChangesStore,
        private alertService: XmAlertService,
    ) {
    }

    private static isPendingState(state: PageChangesStoreType): boolean {
        return state === PageChangesStoreType.EDIT;
    }

    public canDeactivate(): Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.isPending$().pipe(
            take(1),
            switchMap((isPending) => {
                if (isPending) {
                    return this.isAlertConfirmed$();
                } else {
                    return of(true);
                }
            }),
        );
    }

    private isPending$(): Observable<boolean> {
        return this.pageStore.state$().pipe(
            map((i) => PendingChangesGuard.isPendingState(i)),
        );
    }

    private isAlertConfirmed$(): Observable<boolean> {
        return this.showAlert$().pipe(map((i) => !i?.dismiss));
    }

    private showAlert$(): Observable<XmAlertResult> {
        return this.alertService.yesNo({ title: 'common-webapp-ext.alert.leave-the-page' });
    }
}
