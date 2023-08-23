import { Injectable } from '@angular/core';
import { RestRepositoryService } from '@xm-ngx/controllers/features/repository/rest-repository';
import { injectByKey } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable()
export class ResourceDataService<T extends IId = any> {

    private resourceController = injectByKey<RestRepositoryService>('resource');

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);

    private stable: T;

    private useCache: boolean = false;

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = true;
        return this.resourceController.get().pipe(
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
