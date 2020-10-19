import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
    RequestCache,
    RequestCacheFactoryService,
    SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS,
    XmCoreConfig,
} from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { UserSessionService } from '@xm-ngx/core/auth';
import { XmUser } from './xm-user-model';

@Injectable({
    providedIn: 'root',
})
export class XmUserService<T = XmUser> implements OnDestroy {

    protected requestCache: RequestCache<T>;

    constructor(
        protected httpClient: HttpClient,
        private cacheFactoryService: RequestCacheFactoryService,
        protected xmCoreConfig: XmCoreConfig,
        protected sessionService: UserSessionService,
    ) {
        this.requestCache = this.cacheFactoryService.create<T>({
            request: () => this.getUser(),
            onlyWithUserSession: true,
        });
    }

    public user$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public next(value: T | null): Observable<T | null> {
        this.requestCache.next(value);
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    public forceReload(): void {
        this.requestCache.forceReload();
    }

    private getUser(): Observable<T> {
        return this.httpClient.get<T>(
            this.xmCoreConfig.USER_URL,
            { headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS },
        );
    }
}
