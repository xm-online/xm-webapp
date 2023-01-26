import { Observable } from 'rxjs';
import { PageableAndSortable } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

export interface IXmTableCollectionState<T> {
    items: T[];
    error: string | null;
    loading: boolean;
    pageableAndSortable: PageableAndSortable;
}

export interface IXmTableCollectionController<T> {

    state$(): Observable<IXmTableCollectionState<T>>;

    load(pageableAndSortable: PageableAndSortable | null): void;

    reset(): void;

    add(item: T): void;

    remove(item: T): void;

    edit(prev: T, curr: T): void;

    save(): void;

    change(state: IXmTableCollectionState<T>): void;

}

