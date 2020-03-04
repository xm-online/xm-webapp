import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AHttpRestHandler } from '../handlers/a-http-rest-handler';
import { HandlerNext } from '../handlers/a-single-rest-http-handler';
import { LoadingHttpRestHandler } from '../handlers/loading-http-rest-handler';
import { Id, IId, QueryParams } from '../models';
import { IEntityCollection } from './i-entity-collection';

type ObjWithDates = { [key: string]: Date | string } | null;

export function toDate(date: Date | any): string {
    if (date) {
        return date.toISOString();
    }
    return date;
}

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


export class EntityCollectionBase<T extends IId> implements IEntityCollection<T> {

    public readonly loading$: Observable<boolean>;

    protected readonly restHandler: AHttpRestHandler<T>;
    protected readonly loadHttpHandler: LoadingHttpRestHandler<T>;

    constructor({loading, collection}: { loading: LoadingHttpRestHandler<T>, collection: AHttpRestHandler<T> }) {
        this.loadHttpHandler = loading;
        this.restHandler = collection;
        this.loading$ = this.loadHttpHandler.loading$;
    }

    public add(entity: T): Observable<T> {
        return this.handle(entity, () => this.restHandler.add(entity));
    }

    public delete(id: Id): Observable<Id> {
        return this.handle(id, () => this.restHandler.delete(id));
    }

    public getAll(): Observable<T[]> {
        return this.handle(null, () => this.restHandler.getAll());
    }

    public getById(id: Id): Observable<T> {
        return this.handle(id, () => this.restHandler.getById(id));
    }

    public query(params: QueryParams): Observable<T[]> {
        return this.handle(params, () => this.restHandler.query(params));
    }

    public update(update: Partial<T>): Observable<T> {
        return this.handle(update, () => this.restHandler.update(update));
    }

    public replace(update: Partial<T>): Observable<T> {
        return this.handle(update, () => this.restHandler.replace(update));
    }

    public upsert(entity: T): Observable<T> {
        return this.handle(entity, () => this.restHandler.upsert(entity));
    }

    protected handle<R>(request: T | Partial<T> | QueryParams | Id, next: HandlerNext<T>): Observable<R> {
        return next().pipe(
            map((res) => {
                if (res.body && Array.isArray(res.body)) {
                    return this.convertArrayFromServer(res.body);
                }

                if (res.body && res.body.id) {
                    return this.convertFromServer(res.body as T);
                }

                return res.body;
            }),
        );
    }

    /**
     * Convert a T to a JSON which can be sent to the server.
     */
    protected convertForServer(entity: Partial<T>): Partial<T> {
        entity = Object.assign({}, entity);
        entity = convertDates<any>(entity);
        return entity;
    }

    /**
     * Convert a returned JSON object to T.
     */
    protected convertFromServer(entity: T): T {
        return entity;
    }

    protected convertArrayFromServer(entity: T[]): T[] {
        if (entity && Array.isArray(entity)) {
            entity = entity.map(this.convertFromServer.bind(this));
        }
        return entity;
    }

}
