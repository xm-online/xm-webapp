import { HttpClient, HttpParams } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

type QueryParams = HttpParams | {
    [param: string]: (string | string[] | number) | any;
};

type Extra = { xTotalCount: number } | any;

export const X_TOTAL_HEADER = 'X-Total-Count';

export function dateParse(date: string | any): Date {
    if (date) {
        return new Date(date);
    }
    return date;
}

export function toDate(date: Date | any): string {
    if (date) {
        return date.toISOString();
    }
    return date;
}

type ObjWithDates = { [key: string]: Date | string } | null;

/**
 * Convert fields with a type of Date to the ISO strings
 */
export function convertDates<T extends ObjWithDates>(obj: T | any): T {

    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] instanceof Date) {
            obj[prop] = toDate(obj[prop]);
        }
    }

    return obj;
}

export abstract class RestfulBase<T> implements OnDestroy {

    public loading$: Observable<boolean>;

    protected resourceUrl: string;
    protected resourceSearchUrl: string;

    private _$loading: Subject<boolean>;

    constructor(protected http: HttpClient) {
        this._$loading = new BehaviorSubject(false);
        this.loading$ = this._$loading.asObservable();
    }

    public add(entity: T): Observable<T> {
        this._$loading.next(true);
        return this.http.post<T>(this.resourceUrl, this.convertForServer(entity)).pipe(
            finalize(() => this._$loading.next(false)),
            map(this.convertFromServer.bind(this)));
    }

    public create(entity: T): Observable<T> {
        return this.add(entity);
    }

    public update(entity: T): Observable<T> {
        this._$loading.next(true);
        return this.http.put<T>(this.resourceUrl, this.convertForServer(entity)).pipe(
            finalize(() => this._$loading.next(false)),
            map(this.convertFromServer.bind(this)));
    }

    public getAll(): Observable<T[]> {
        this._$loading.next(true);
        return this.http.get<T>(this.resourceUrl).pipe(
            finalize(() => this._$loading.next(false)),
            map(this.convertArrayFromServer.bind(this)));
    }

    public find(key: number | string): Observable<T> {
        return this.getById(key);
    }

    public getById(key: number | string): Observable<T> {
        this._$loading.next(true);
        return this.http.get<T>(`${this.resourceUrl}/${key}`).pipe(
            finalize(() => this._$loading.next(false)),
            map(this.convertFromServer.bind(this)));
    }

    public delete(key: number | string): Observable<undefined> {
        this._$loading.next(true);
        return this.http.delete<undefined>(`${this.resourceUrl}/${key}`).pipe(
            finalize(() => this._$loading.next(false)));
    }

    public query<R extends QueryParams>(params?: R): Observable<T[] & Extra> {
        return this._querySearchRequest(this.resourceUrl, params);
    }

    public search<R extends QueryParams>(params?: R): Observable<T[] & Extra> {
        return this._querySearchRequest(this.resourceSearchUrl, params);
    }

    public ngOnDestroy(): void {
        this._$loading.complete();
    }

    /**
     * Convert a returned JSON object to T.
     */
    protected convertFromServer(entity: T): T {
        return entity;
    }

    /**
     * Convert a T to a JSON which can be sent to the server.
     */
    protected convertForServer(entity: T): T {
        entity = Object.assign({}, entity);
        entity = convertDates<any>(entity);
        return entity;
    }

    protected convertArrayFromServer(entity: T[]): T[] {
        if (entity && Array.isArray(entity)) {
            entity = entity.map(this.convertFromServer.bind(this));
        }
        return entity;
    }

    private _querySearchRequest(url: string, params: QueryParams): Observable<T[] & Extra> {
        this._$loading.next(true);
        return this.http.get<T[]>(url, {params, observe: 'response'}).pipe(
            finalize(() => this._$loading.next(false)),
            map((res) => {
                const body: T[] & Extra = this.convertArrayFromServer(res.body);
                body.xTotalCount = parseInt(res.headers.get(X_TOTAL_HEADER), 10);
                return body;
            }));
    }
}
