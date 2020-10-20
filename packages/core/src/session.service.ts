import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';


/**
 * Keeping information about active session.
 * Broadcast session changes.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {

    protected session$: BehaviorSubject<unknown | null> = new BehaviorSubject<unknown | null>(null);

    public get<T = unknown>(key?: string): Observable<T> {
        return this.session$.asObservable().pipe(pluck(key));
    }

    public store<T = unknown>(key: string, data: T): void {
        const prevValue = this.session$.getValue();
        const newValue = _.merge(prevValue, { [key]: data });
        return this.session$.next(newValue);
    }

    public clear(): void {
        this.session$.next(null);
    }

}
