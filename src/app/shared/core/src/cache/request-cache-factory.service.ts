import { Injectable } from '@angular/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { XmSessionService } from '../xm-session.service';
import { RequestCache } from './request-cache';
import { Observable, of } from 'rxjs';

interface RequestCacheFactoryParams<T> {
    request: () => Observable<T>;
    /**
     * If a user have a session the RequestCache will make a request to api
     * Otherwise it returns null
     */
    onlyWithUserSession?: boolean;
}

@Injectable({providedIn: 'root'})
export class RequestCacheFactoryService {

    constructor(private sessionService: XmSessionService) {
    }

    public create<T>(params: RequestCacheFactoryParams<T>): RequestCache<T> {
        const request = params.request;
        const emptyRequest = (): Observable<null> => of(null);
        const storage = new RequestCache<T>(request);

        if (params.onlyWithUserSession) {
            this.sessionService.isActive()
                .pipe(takeUntilOnDestroy(storage))
                .subscribe((active) => storage.setAndReload(active ? request : emptyRequest));
        }

        return storage;
    }
}
