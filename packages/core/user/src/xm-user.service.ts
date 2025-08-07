import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { RequestCache, RequestCacheFactoryService, XmCoreConfig, XmSessionService } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { XmUser } from './xm-user-model';
import { AppStore } from '@xm-ngx/ngrx-store';
import { map } from 'rxjs/operators';
import { AppStoreSource } from '@xm-ngx/ngrx-store/src/models/app-store.model';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root',
})
export class XmUserService<T = XmUser> implements OnDestroy {

    protected requestCache: RequestCache<T>;
    private appStore = inject<AppStoreSource>(AppStore);

    constructor(
        protected httpClient: HttpClient,
        private cacheFactoryService: RequestCacheFactoryService,
        protected xmCoreConfig: XmCoreConfig,
        protected sessionService: XmSessionService,
        private account: AccountService,
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

    private getUser(): Observable<any> {
        return this.account.get().pipe(map((user) => {
            const {body: data} = user;
            if (data) {
                this.appStore.updateUser(data);
                return data;
            }
            return {};
        }));
    }
}
