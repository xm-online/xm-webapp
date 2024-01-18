import { inject, Injectable, Injector, ProviderToken } from '@angular/core';
import { XmDynamicInjectionTokenStoreService } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep, get, isEmpty } from 'lodash';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { RestRepositoryService } from '@xm-ngx/controllers/features/repository/rest-repository';

@Injectable()
export class ResourceArrayDataService<T extends IId = any> {

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>({} as T);

    private stable: T;

    private useCache: boolean = false;

    public config: any;
    private injector = inject(Injector);
    private injectionTokenService = inject(XmDynamicInjectionTokenStoreService);

    private get key(): string {
        return this.config?.dataController?.key || 'data';
    }
    public getSync(): T {
        return cloneDeep(this.data$.value);
    }

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = true;
        return this.getControllerByKey<RestRepositoryService>(this.key).get().pipe(
            filter(v => !isEmpty(v)),
            map(data => {
                const fieldValue = this.config?.path ? get(data, this.config.path) : data;
                return this.config.arrayItemIndex !== undefined ? fieldValue[this.config.arrayItemIndex] : fieldValue;
            }),
            switchMap(data => {
                this.data$.next(data);
                this.stable = cloneDeep(data);
                return this.data$.pipe(shareReplay(1));
            }),
        );
    }

    public update(entity: T): Observable<T> {
        this.data$.next(entity);
        return this.data$;
    }

    public save(): Observable<T> {
        if (this.data$.value?.id) {
            return this.getControllerByKey<RestRepositoryService>(this.key).update(this.data$.value).pipe(
                tap(entity => this.data$.next(entity)),
            );
        }
        return this.data$;
    }

    public reset(): Observable<T> {
        this.data$.next(cloneDeep(this.stable));
        return this.data$;
    }
    private getControllerByKey<R>(key: string): R {
        const providerToken: ProviderToken<any> = this.injectionTokenService.resolve(key);
        return this.injector.get<R>(providerToken, undefined,{optional: true});
    }
}
