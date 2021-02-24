import { Injectable, OnDestroy } from '@angular/core';
import { RequestCache } from './cache/request-cache';
import { IIdpConfig } from './xm-public-idp-config-model';
import { HttpClient } from '@angular/common/http';
import { RequestCacheFactoryService } from './cache/request-cache-factory.service';
import { XmCoreConfig } from './xm-core-config';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class XmPublicIdpConfigService<T = IIdpConfig> implements OnDestroy {
    public readonly IDP_PUBLIC_CONFIG_URL: string;

    private requestCache: RequestCache<T>;

    constructor(private httpClient: HttpClient,
                private cacheFactoryService: RequestCacheFactoryService,
                private xmCoreConfig: XmCoreConfig) {
        this.IDP_PUBLIC_CONFIG_URL = this.xmCoreConfig.IDP_PUBLIC_CONFIG_URL;
        this.requestCache = this.cacheFactoryService.create<T>({request: () => this.publicAPI()});
    }

    public config$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private publicAPI(): Observable<T> {
        return this.httpClient.get<T>(this.IDP_PUBLIC_CONFIG_URL);
    }
}
