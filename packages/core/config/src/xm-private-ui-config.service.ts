import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { RequestCache, RequestCacheFactoryService, XmCoreConfig } from '@xm-ngx/core';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UIPrivateConfig } from './xm-ui-config-model';
import { XmPermissionService } from '@xm-ngx/core/permission';

@Injectable()
export class XmPrivateUiConfigService<T = UIPrivateConfig> implements OnDestroy {
    public readonly UI_PRIVATE_CONFIG_URL: string;
    public readonly UI_PRIVATE_CONFIG_PERMISSION: string;

    private requestCache: RequestCache<T>;

    constructor(private httpClient: HttpClient,
                private cacheFactoryService: RequestCacheFactoryService,
                private permissionService: XmPermissionService,
                private xmCoreConfig: XmCoreConfig) {
        this.UI_PRIVATE_CONFIG_URL = this.xmCoreConfig.UI_PRIVATE_CONFIG_URL;
        this.UI_PRIVATE_CONFIG_PERMISSION = this.xmCoreConfig.UI_PRIVATE_CONFIG_PERMISSION;
        this.requestCache = this.cacheFactoryService.create<T>({
            request: () => this.resolveConfigAPI(),
            onlyWithUserSession: true,
        });
    }

    public config$(): Observable<T | null> {
        return this.requestCache.get();
    }

    public ngOnDestroy(): void {
        this.requestCache.ngOnDestroy();
    }

    private resolveConfigAPI(): Observable<T> {
        return this.permissionService.hasPrivilege(this.UI_PRIVATE_CONFIG_PERMISSION).pipe(
            take(1),
            switchMap((allow) => {
                if (allow) {
                    return this.privateAPI();
                }
                return of(null);

            }),
        );
    }

    private privateAPI(): Observable<T> {
        return this.httpClient.get<T>(this.UI_PRIVATE_CONFIG_URL);
    }

}
