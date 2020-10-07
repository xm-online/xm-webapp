import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Id, IEntityCollection, IId, QueryParams } from './i-entity-collection';

export class EntityCollectionBase<T extends IId = unknown> {
    public loading$: Observable<boolean>;
    protected collection: IEntityCollection<T>;

    constructor(collection: IEntityCollection<T>) {
        this.setCollection(collection);
    }

    public create(entity: T, params?: QueryParams): Observable<T> {
        return this.collection.create(entity, params)
            .pipe(map((res) => res.body));
    }

    public delete(id: Id, params?: QueryParams): Observable<unknown> {
        return this.collection.delete(id, params)
            .pipe(map((res) => res.body));
    }

    public getById(id: Id, params?: QueryParams): Observable<T> {
        return this.collection.getById(id, params)
            .pipe(map((res) => res.body));
    }

    public getAll(params?: QueryParams): Observable<T[]> {
        return this.collection.getAll(params)
            .pipe(map((res) => res.body));
    }

    public query(params: QueryParams): Observable<T[]> {
        return this.collection.query(params)
            .pipe(map((res) => res.body));
    }

    public update(update: Partial<T>, params?: QueryParams): Observable<T> {
        return this.collection.update(update, params)
            .pipe(map((res) => res.body));
    }

    public upsert(entity: T, params?: QueryParams): Observable<T> {
        return this.collection.upsert(entity, params)
            .pipe(map((res) => res.body));
    }

    protected setCollection(collection: IEntityCollection<T>): void {
        this.collection = collection;
        this.loading$ = collection.loading$;
    }
}
