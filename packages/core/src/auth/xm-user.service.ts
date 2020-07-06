import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequestCache } from '../cache/request-cache';
import { RequestCacheFactoryService } from '../cache/request-cache-factory.service';
import { SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS } from '../error-handler.interceptor';
import { XmCoreConfig } from '../xm-core-config';
import { XmSessionService } from '../xm-session.service';
import { XmSuperAdminService } from './xm-super-admin.service';
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
        protected sessionService: XmSessionService,
        protected superAdminService: XmSuperAdminService,
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


    private getUser(): Observable<T> {
        return this.httpClient.get<T>(
            this.xmCoreConfig.USER_URL,
            { headers: SKIP_ERROR_HANDLER_INTERCEPTOR_HEADERS },
        ).pipe(
            switchMap((u) => {
                if (u && this.superAdminService.isSuperAdmin(u)) {
                    return this.superAdminService.modifyUser<T>(u);
                } else {
                    return of(u);
                }
            }),
        );
    }
}
