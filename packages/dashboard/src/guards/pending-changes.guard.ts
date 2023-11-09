import { inject, Injectable } from '@angular/core';
import { EDIT_ACTION, EDIT_EVENT, EDIT_STATE, EditDisableState } from './edit-state-store.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { PageChangesStore, PageChangesStoreType } from '@xm-ngx/core/dashboard';

@Injectable()
export class EditStateStoreService {
    private pageChangesStore= inject(PageChangesStore);
    private state: BehaviorSubject<EDIT_STATE> = new BehaviorSubject<EDIT_STATE>(EDIT_STATE.EDIT);
    public state$: Observable<EDIT_STATE> = this.state.asObservable();
    public disable$: BehaviorSubject<EditDisableState> = new BehaviorSubject<EditDisableState>({
        [EDIT_ACTION.EDIT]: false,
        [EDIT_ACTION.SAVE]: false,
        [EDIT_ACTION.CANCEL]: false,
    }); // there could be several error producers
    private event: Subject<EDIT_EVENT> = new Subject<EDIT_EVENT>();
    public event$: Observable<EDIT_EVENT> = this.event.asObservable();

    public change(state: EDIT_STATE): void {
        if (state === EDIT_STATE.EDIT) {
            this.pageChangesStore.setState(PageChangesStoreType.EDIT);
        } else {
            this.pageChangesStore.setState(PageChangesStoreType.PRISTINE);
        }

        this.state.next(state);
    }

    public emitEvent(event: EDIT_EVENT): void {
        this.event.next(event);
    }

    public disable(actions: EDIT_ACTION[] = []): void {
        if (actions.length) {
            const state = cloneDeep(this.disable$.value);
            actions.forEach(action => state[action] = true);
            this.disable$.next(state);
        } else {
            this.disable$.next({
                [EDIT_ACTION.EDIT]: true,
                [EDIT_ACTION.SAVE]: true,
                [EDIT_ACTION.CANCEL]: true,
            });
        }
    }

    public enable(actions: EDIT_ACTION[] = []): void {
        if (actions.length) {
            const state = cloneDeep(this.disable$.value);
            actions.forEach(action => state[action] = false);
            this.disable$.next(state);
        } else {
            this.disable$.next({
                [EDIT_ACTION.EDIT]: false,
                [EDIT_ACTION.SAVE]: false,
                [EDIT_ACTION.CANCEL]: false,
            });
        }
    }

    public isDisabled(action: EDIT_ACTION): boolean {
        return this.disable$.value[action];
    }
}
