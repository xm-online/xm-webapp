import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';


/**
 * Keeping information about active session.
 * Broadcast session changes.
 */
@Injectable({ providedIn: 'root' })
export class SessionService<T = unknown> {

    protected session$: ReplaySubject<T | null> = new ReplaySubject<T>(1);

    public get(): Observable<T> {
        return this.session$.asObservable();
    }

    public store(data: T): void {
        return this.session$.next(data);
    }

    public clear(): void {
        this.session$.next(null);
    }

}
