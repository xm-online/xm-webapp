/*
 Copyright 2016-2021 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { filter, share, map } from 'rxjs/operators';
import { JhiEventWithContent } from './event-with-content.model';

/**
 * An utility class to manage RX events
 */
@Injectable({
    providedIn: 'root',
})
export class JhiEventManager {
    public observable: Observable<JhiEventWithContent<any> | string>;
    public observer: Observer<JhiEventWithContent<any> | string>;

    constructor() {
        this.observable = Observable.create((observer: Observer<JhiEventWithContent<any> | string>) => {
            this.observer = observer;
        }).pipe(share());
    }

    /**
     * Method to broadcast the event to observer
     */
    public broadcast(event: JhiEventWithContent<any> | string): void {
        if (this.observer) {
            this.observer.next(event);
        }
    }

    /**
     * Method to subscribe to an event with callback
     */
    public subscribe(eventName: string, callback: any): Subscription {
        const subscriber: Subscription = this.observable
            .pipe(
                filter((event: JhiEventWithContent<any> | string) => {
                    if (typeof event === 'string') {
                        return event === eventName;
                    }
                    return event.name === eventName;
                }),
                map((event: JhiEventWithContent<any> | string) => {
                    if (typeof event !== 'string') {
                        // when releasing generator-jhipster v7 then current return will be changed to
                        // (to avoid redundant code response.content in JhiEventManager.subscribe callbacks):
                        // return event.content;
                        return event;
                    }

                    return null;
                }),
            )
            .subscribe(callback);
        return subscriber;
    }

    /**
     * Method to unsubscribe the subscription
     */
    public destroy(subscriber: Subscription): void {
        subscriber.unsubscribe();
    }
}
