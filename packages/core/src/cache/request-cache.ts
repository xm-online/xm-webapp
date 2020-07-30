import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { of, ReplaySubject, Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

export interface IRequestCache<T> extends OnDestroy {

    get(): Observable<T | null>;

    forceReload(): void;

    ngOnDestroy(): void;

    clear(): void;
}

@Injectable()
export class RequestCache<T> implements IRequestCache<T> {

    protected cache: Subject<T | null>;
    protected cacheObservable: Observable<T | null>;
    protected subscription: Subscription;

    public request: () => Observable<T | null> = (): Observable<null> => of(null);

    public cacheFactory(): Subject<T> {
        return new ReplaySubject<T>(1);
    }

    public cacheObservableFactory(): Observable<T> {
        return this.cache.asObservable();
    }

    public getCache(): Subject<T | null> {
        return this.cache;
    }

    public get(): Observable<T | null> {
        if (this.cacheObservable) {
            return this.cacheObservable;
        }

        if (!this.cache) {
            this.initialize();
            this.updateData();
        }
        return this.cacheObservable = this.cacheObservableFactory();
    }

    public ngOnDestroy(): void {
        if (this.cache) {
            this.cache.complete();
        }
        delete this.cacheObservable;
        takeUntilOnDestroyDestroy(this);
    }

    public setAndReload(request: () => Observable<T>): void {
        this.request = request;
        this.forceReload();
    }

    public forceReload(): void {
        if (!this.cache) {
            this.initialize();
        }
        this.updateData();
    }

    public clear(): void {
        if (!this.cache) {
            return;
        }

        this.cache.next(null);
    }

    public next(value: T): void {
        if (!this.cache) {
            this.initialize();
        }

        this.cache.next(value);
    }

    private initialize(): void {
        this.cache = this.cacheFactory();
    }

    private updateData(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.request().subscribe({
            next: (data) => this.cache.next(data),
            error: (err) => this.cache.error(err),
        });
    }
}
