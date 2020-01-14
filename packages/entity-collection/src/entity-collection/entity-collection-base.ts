import { Observable } from 'rxjs';
import { HttpHandler } from '../handlers/http-handler';
import { LoadHttpHandler } from '../handlers/load-http-handler';
import { Id, IId, QueryParams } from '../models';
import { IEntityCollection } from './i-entity-collection';

export class EntityCollectionBase<T extends IId> implements IEntityCollection<T> {

    public readonly loading$: Observable<boolean>;

    protected readonly entityCollection: IEntityCollection<T>;
    protected readonly loadHttpHandler: LoadHttpHandler<T>;

    constructor({loading, collection}: { loading: LoadHttpHandler<T>, collection: HttpHandler<T> }) {
        this.loadHttpHandler = loading;
        this.entityCollection = collection;
        this.loading$ = this.loadHttpHandler.loading$;
    }

    public add(entity: T): Observable<T> {
        return this.entityCollection.add(entity);
    }

    public delete(id: Id): Observable<Id> {
        return this.entityCollection.delete(id);
    }

    public getAll(): Observable<T[]> {
        return this.entityCollection.getAll();
    }

    public getById(id: Id): Observable<T> {
        return this.entityCollection.getById(id);
    }

    public query(params: QueryParams): Observable<T[]> {
        return this.entityCollection.query(params);
    }

    public update(update: Partial<T>): Observable<T> {
        return this.entityCollection.update(update);
    }

    public replace(update: Partial<T>): Observable<T> {
        return this.entityCollection.replace(update);
    }

    public upsert(entity: T): Observable<T> {
        return this.entityCollection.upsert(entity);
    }

}
