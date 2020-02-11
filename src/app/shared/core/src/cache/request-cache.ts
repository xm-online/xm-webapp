import {interval, ReplaySubject} from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {startWith, takeUntil} from 'rxjs/operators';
import {IRequestCache} from './i-request-cache';

const TEN_MIN_INTERVAL = 600000;
const REQUEST_TIMEOUT = 60000;

const DEFAULT_OPTIONS = {
    reloadInterval: TEN_MIN_INTERVAL,
    requestTimeOut: REQUEST_TIMEOUT,
};

export class RequestCache<T> implements IRequestCache<T> {

    constructor(protected request: () => Observable<T>,
                protected options: typeof DEFAULT_OPTIONS = DEFAULT_OPTIONS) {
    }

    private _cache$: ReplaySubject<T | null>;

    public cache$(): Observable<T | null> {
        if (!this._cache$) {
            this.initialize();
        }
        return this._cache$.asObservable();
    }

    public ngOnDestroy(): void {
        this._cache$.complete();
    }

    public forceReload(): void {
        this.updateData();
    }

    public clear(): void {
        this._cache$.next(null);
    }

    protected next(value: T): void {
        this._cache$.next(value);
    }

    private initialize(): void {
        this._cache$ = new ReplaySubject<T>(1);
        interval(this.options.reloadInterval).pipe(
            startWith(0),
        ).subscribe(this.updateData.bind(this));
    }

    private updateData(): void {
        this.request().pipe(
            takeUntil(interval(this.options.requestTimeOut)),
        ).subscribe({
            next: this._cache$.next.bind(this._cache$),
            error: this._cache$.error.bind(this._cache$),
        });
    }
}
