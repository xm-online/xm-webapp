import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TableEventType } from '../directives/xm-table.model';

type EventManagerKey = string;

interface EventManagerAction<T = any> {
    name: EventManagerKey;
    payload?: T;
}

@Injectable({
    providedIn: 'root',
})
export class XmTableEventManagerService {
    private dispatcher: Subject<EventManagerAction> = new Subject<EventManagerAction>();

    public broadcast<T>(event: EventManagerAction<T>): void {
        this.dispatcher.next(event);
    }

    public listenTo<T>(eventName: EventManagerKey): Observable<EventManagerAction<T>> {
        return this.dispatcher.asObservable().pipe(filter(i => i.name === eventName));
    }

    public getUpdateEventName(name: string): string {
        return `${name}_${TableEventType.UPDATE_TABLE}`;
    }
}
