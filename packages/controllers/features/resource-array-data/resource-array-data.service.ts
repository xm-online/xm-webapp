import { Injectable } from '@angular/core';
import { RestRepositoryService } from '@xm-ngx/controllers/features/repository/rest-repository';
import { injectByKey } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep, get, isEmpty } from 'lodash';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class ResourceArrayDataService<T extends IId = any> {

    private resourceController = injectByKey<RestRepositoryService>('data');

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>({} as T);

    private stable: T;

    private useCache: boolean = false;

    public config: any;

    public getSync(): T {
        return cloneDeep(this.data$.value);
    }

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = true;
        return this.resourceController.get().pipe(
            filter(v => !isEmpty(v)),
            map(data => {
                const fieldValue = get(data, this.config.path);
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
            return this.resourceController.update(this.data$.value).pipe(
                tap(entity => this.data$.next(entity)),
            );
        }
        return this.data$;
    }

    public reset(): Observable<T> {
        this.data$.next(cloneDeep(this.stable));
        return this.data$;
    }
}
