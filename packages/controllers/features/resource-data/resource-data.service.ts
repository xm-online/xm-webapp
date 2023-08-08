import { inject, Injectable } from '@angular/core';
import {
    XmDynamicInjectionTokenStoreService
} from '@xm-ngx/dynamic/src/services/xm-dynamic-injection-token-store.service';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep } from 'lodash';
import { RestRepositoryService } from 'packages/controllers/features/repository/rest-repository';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class ResourceDataService<T extends IId = any> {

    private dynamicInjectionTokenStore = inject(XmDynamicInjectionTokenStoreService);

    private resourceController = inject<RestRepositoryService>(this.dynamicInjectionTokenStore.resolve('resource'));

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);

    private stable: T;

    private useCache: boolean = false;

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = true;
        return this.resourceController.get().pipe(
            // map(response => response.body),
            switchMap(data => {
                this.data$.next(data);
                this.stable = cloneDeep(data);
                return this.data$.pipe(shareReplay(1));
            }),
        );
    }

    public update(entity: T): Observable<T> {
        console.log('update');
        this.data$.next(entity);
        return this.data$;
    }

    public save(): Observable<T> {
        if (this.data$.value?.id) {
            return this.resourceController.update(this.data$.value);
        }
        //     this.resourceController.create(this.data$.value)
        return this.data$;
    }

    public reset(): Observable<T> {
        this.data$.next(cloneDeep(this.stable));
        return this.data$;
    }
}
