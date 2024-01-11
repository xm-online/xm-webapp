import { inject, Injectable } from '@angular/core';
import { RestRepositoryService } from '@xm-ngx/controllers/features/repository/rest-repository';
import { injectByKey } from '@xm-ngx/dynamic';
import { IId } from '@xm-ngx/interfaces';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';
import { filter, shareReplay, tap } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
const DEFAULT_DURATION = 300;
@Injectable()
export class ResourceDataService<T extends IId = any> {

    private resourceController = injectByKey<RestRepositoryService>('resource');
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    private data$: BehaviorSubject<T> = new BehaviorSubject<T>({} as T);

    private stable: T;

    private useCache: boolean = false;
    public config: DataResourceOptions;
    private previousId: number = null;
    private previousParams: Params=[];

    public getSync(): T {
        return cloneDeep(this.data$.value);
    }

    public get(): Observable<T> {
        if (this.useCache) {
            return this.data$.pipe(shareReplay(1));
        }

        this.useCache = true;
        return this.activatedRoute.queryParams.pipe(
            filter(params => this.hasRelevantParamChanges(params,this.config?.updateEntityChangeParams||[])),
            switchMap((params) => {
                return this.resourceController.get(params||null).pipe(
                    debounceTime(this.config?.updateDelay||DEFAULT_DURATION),
                    switchMap((data) => {
                        this.data$.next(data);
                        this.stable = cloneDeep(data);
                        return this.data$.pipe(shareReplay(1));
                    }),
                );
            }),
        );
    }

    private hasRelevantParamChanges(currentParams: Params, relevantParams: string[]): boolean {
        for (const key of relevantParams) {
            if (this.shouldFilterParams(currentParams) && currentParams[key] !== this.previousParams[key]) {
                this.previousParams = {...currentParams};
                return true;
            }
        }
        return false;
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

    private shouldFilterParams(params: Params): boolean {
        const {updateEntityChangeParams} = this.config || {};
        if (updateEntityChangeParams) {
            const param = params[updateEntityChangeParams[0]];
            const hasIdChanged: boolean = param !== this.previousId;
            this.previousId = param;
            return hasIdChanged;
        }
        return true;
    }
}

interface DataResourceOptions{
    updateIfEntityChange?: boolean,
    updateEntityChangeParams?: string[],
    updateDelay?: number
}
