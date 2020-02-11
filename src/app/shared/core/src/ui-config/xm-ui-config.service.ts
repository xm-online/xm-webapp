import {HttpClient} from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';

import {UIConfig} from './ui-config-model';
import {takeUntilOnDestroy} from '@xm-ngx/shared/operators';
import {RequestCache} from '../cache/request-cache';
import {XmSessionService} from "../session/xm-session.service";

export const UI_CONFIG_URL = 'config/api/profile/webapp/settings-public.yml?toJson';

@Injectable({providedIn: 'root'})
export class XmUiConfigService<T = UIConfig> implements OnDestroy {

    public url: string = UI_CONFIG_URL;
    protected requestCache: RequestCache<T>;

    constructor(protected httpClient: HttpClient,
                protected sessionService: XmSessionService) {
        this.requestCache = new RequestCache(this.getAll.bind(this));
        this.sessionService.get().pipe(takeUntilOnDestroy(this)).subscribe((session) => {
            console.log('asd11111', session.active);
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
