import { Injectable } from '@angular/core';
import { EDIT_EVENT, EDIT_STATE } from './edit-state-store.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class EditStateStoreService {
    private state: BehaviorSubject<EDIT_STATE> = new BehaviorSubject<EDIT_STATE>(EDIT_STATE.EDIT);
    public state$: Observable<EDIT_STATE> = this.state.asObservable();
    public disable$: Observable<EDIT_STATE> = this.state.asObservable(); // there could be several error producers
    private event: Subject<EDIT_EVENT> = new Subject<EDIT_EVENT>();
    public event$: Observable<EDIT_EVENT> = this.event.asObservable();

    public change(state: EDIT_STATE): void {
        this.state.next(state);
    }

    public emitEvent(event: EDIT_EVENT): void {
        this.event.next(event);
    }
}
