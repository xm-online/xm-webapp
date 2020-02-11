import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';

import {UIConfig} from './ui-config-model';
import {takeUntilOnDestroy} from '@xm-ngx/shared/operators';
import {RequestCache} from '../cache/request-cache';
import {AuthServerProvider} from '../../../auth/auth-jwt.service';

export const UI_CONFIG_URL = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({providedIn: 'root'})
export class UiConfigService<T = UIConfig> implements OnDestroy {

    public url: string = UI_CONFIG_URL;
    protected requestCache: RequestCache<T>;

    constructor(protected httpClient: HttpClient,
                protected authServerProvider: AuthServerProvider) {
        this.requestCache = new RequestCache(this.getAll.bind(this));
        this.authServerProvider.session$.pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            if (session.active) {
                this.requestCache.forceReload();
            } else {
                this.requestCache.clear();
            }
        });
    }

    public get cache$(): Observable<T | null> {
        return this.requestCache.cache$();
    }

    public getAll(): Observable<T> {
        return this.httpClient.get<T>(this.url);
    }

    protected request(): Observable<T> {
        return this.getAll();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }
}
