import { Id, IId } from '@xm-ngx/shared/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryParams } from './i-entity-collection';
import { IEntityCollectionPageable, Pageable } from './i-entity-collection-pageable';

export class EntityCollectionBase<T extends IId = unknown, Extra extends Pageable = Pageable> {
    public loading$: Observable<boolean>;
    protected collection: IEntityCollectionPageable<T, Extra>;

    constructor(collection: IEntityCollectionPageable<T, Extra>) {
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

    public getAll(params?: QueryParams): Observable<T[] & Extra> {
        return this.collection.getAll(params)
            .pipe(map((res) => res.body));
    }

    public query(params: QueryParams): Observable<T[] & Extra> {
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

    protected setCollection(collection: IEntityCollectionPageable<T, Extra>): void {
        if (!collection) {
            return;
        }
        this.collection = collection;
        this.loading$ = collection.loading$;
    }
}
