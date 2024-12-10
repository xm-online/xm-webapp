import { inject, Injectable } from '@angular/core';
import { RestRepositoryService } from '@xm-ngx/controllers/features/repository/rest-repository';
import { injectByKey } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { DataResourceOptions } from './resource-data.model';

@Injectable()
export class ResourceDataService<T extends IId = any> {

    private resourceController = injectByKey<RestRepositoryService>('resource');
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>({} as T);

    private stable: T;

    private useCache: boolean = false;
    public config: DataResourceOptions;

    public getSync(): T {
        return cloneDeep(this.data$.value);
    }

    public get(force?: boolean): Observable<T> {
        if (this.useCache && !force) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = this.config?.skipCache ? false : true;

        if (this.config?.listenQueryParams) {
            return this.activatedRoute.queryParams.pipe(
                distinctUntilChanged((prev: Params, next: Params) => {
                    for (const key of this.config.listenQueryParams) {
                        if (prev[key] !== next[key]) {
                            return false;
                        }
                    }
                    return true;
                }),
                switchMap((params: Params) => {
                    return this.getDataFromResource(params);
                }),
            );
        }
        return this.getDataFromResource();

    }

    private getDataFromResource(params?: Params): Observable<T> {
        return this.resourceController.get(params || null).pipe(
            switchMap((data) => {
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
                tap(entity => {
                    this.data$.next(entity);
                    this.stable = cloneDeep(entity);
                }),
            );
        }
        return this.data$;
    }

    public reset(): Observable<T> {
        this.data$.next(cloneDeep(this.stable));
        return this.data$;
    }

}


