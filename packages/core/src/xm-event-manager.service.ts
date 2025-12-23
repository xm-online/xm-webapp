import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

type EventManagerKey = string;
export type XmEventManagerKey = EventManagerKey;

export interface XmEventManagerAction<T = any> {
    name: EventManagerKey;
    payload?: T;

    // Backward compatibility
    [key: string]: any;
}

@Injectable({
    providedIn: 'root',
})
export class XmEventManagerService implements OnDestroy {

    public readonly observable: Observable<XmEventManagerAction>;

    /** @deprecated use 'observable' instead */
    public observer: Observer<XmEventManagerAction>;

    protected dispatcher: Subject<XmEventManagerAction> = new Subject<XmEventManagerAction>();

    constructor() {
        this.observer = this.dispatcher;
        this.observable = this.dispatcher.asObservable();
    }

    /**
     * Method to broadcast the event to observer
     */
    public broadcast<T>(event: XmEventManagerAction<T>): void {
        this.dispatcher.next(event);
    }

    /**
     * @deprecated use observable instead
     * Method to subscribe to an event with callback
     */
    public subscribe(eventName: EventManagerKey, callback: (i: XmEventManagerAction) => void): Subscription {
        return this.observable.pipe(filter(i => i.name === eventName)).subscribe(callback);
    }

    /**
     * Method to get stream by event name
     */
    public listenTo<T>(eventName: EventManagerKey): Observable<XmEventManagerAction<T>> {
        return this.observable.pipe(filter(i => i.name === eventName));
    }

    /**
     * @deprecated use subscriber.unsubscribe(); instead
     * Method to unsubscribe the subscription
     */
    public destroy(subscriber: Subscription): void {
        subscriber.unsubscribe();
    }

    public ngOnDestroy(): void {
        this.dispatcher.complete();
    }

}
