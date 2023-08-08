import { inject, Injectable } from '@angular/core';
import {
    XmDynamicInjectionTokenStoreService
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { RestRepositoryService } from 'packages/controllers/features/repository/rest-repository';
import { Observable, ReplaySubject, switchMap } from 'rxjs';

@Injectable()
export class ResourceDataService<T = any> {

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);

    private resourceController = inject<RestRepositoryService>(this.dynamicInjectionTokenStore.resolve('resource'));

    private data$: ReplaySubject<T> = new ReplaySubject<T>(1);

    private useCache: boolean = false;

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$;
        }

        this.useCache = true;
        return this.resourceController.fetch().pipe(
            switchMap(data => {
                this.data$.next(data);
                return this.data$;
            }),
        );
    }

    public update(entity: T): Observable<T> {
        return this.data$;
    }

    public save(): Observable<T> {
        console.log('save data on server');
        return this.data$;
    }

    public reset(): Observable<T> {
        console.log('reset data on server');
        return this.data$;
    }
}
