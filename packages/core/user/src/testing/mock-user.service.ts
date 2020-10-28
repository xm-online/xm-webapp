import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { XmUser } from '../xm-user-model';

@Injectable()
export class MockUserService<T = XmUser> implements OnDestroy {
    public user$(): Observable<T | null> {
        return of(null);
    }

    public next(): Observable<T | null> {
        return of(null);
    }

    public ngOnDestroy(): void {
        // Mock empty
    }

    public forceReload(): void {
        // Mock empty
    }

}
