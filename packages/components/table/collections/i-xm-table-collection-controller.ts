import { Observable } from 'rxjs';
import {
    PageableAndSortable,
    QueryParamsPageable,
} from '@xm-ngx/repositories';

export interface IXmTableCollectionState<T> {
    items: T[];
    error: string | null;
    loading: boolean;
    pageableAndSortable: PageableAndSortable;
}

export interface XmFilterQueryParams {
    pageableAndSortable: PageableAndSortable,
    filterParams: QueryParamsPageable,
    includes?: string,
}

export interface IXmTableCollectionController<T> {

    state$(): Observable<IXmTableCollectionState<T>>;

    load(queryParams: XmFilterQueryParams): void;

    reset(): void;

    add(item: T): void;

    remove(item: T): void;

    edit(prev: T, curr: T): void;

    save(): void;

    change(state: IXmTableCollectionState<T>): void;

}

