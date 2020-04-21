import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { RequestCacheFactoryService } from '../cache/request-cache-factory.service';
import { Observable } from 'rxjs';
import { RequestCache } from '../cache/request-cache';
import { XmCoreConfig } from '../xm-core-config';
import { UIPublicConfig } from './xm-ui-config-model';

@Injectable({
    providedIn: 'root',
})
export class XmPublicUiConfigService<T = UIPublicConfig> implements OnDestroy {
    private requestCache: RequestCache<T>;

    constructor(private httpClient: HttpClient,
                private cacheFactoryService: RequestCacheFactoryService,
                private xmCoreConfig: XmCoreConfig) {
        this.requestCache = this.cacheFactoryService.create<T>({request: () => this.publicAPI()});
    }

    public get config$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private publicAPI(): Observable<T> {
        return this.httpClient.get<T>(this.xmCoreConfig.UI_PUBLIC_CONFIG_URL);
    }

}
