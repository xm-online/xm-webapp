import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IXmTableCollectionState } from './i-xm-table-collection-controller';
import { assign, cloneDeep } from 'lodash';
import { PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';

@Injectable()
export abstract class AXmTableStateCollectionController<T> {

    protected _state: BehaviorSubject<IXmTableCollectionState<T>> = new BehaviorSubject({
        items: [],
        error: null,
        loading: false,
        pageableAndSortable: cloneDeep(PAGEABLE_AND_SORTABLE_DEFAULT),
    } as IXmTableCollectionState<T>);

    protected get items(): T[] {
        return this._state.value.items;
    }

    public state$(): Observable<IXmTableCollectionState<T>> {
        return this._state;
    }

    public change(state: IXmTableCollectionState<T>): void {
        this._state.next(cloneDeep(state));
    }

    public changePartial(state: Partial<IXmTableCollectionState<T>>): void {
        const prevState = this._state;
        const newSate = assign({}, prevState, state) as IXmTableCollectionState<T>;
        this._state.next(cloneDeep(newSate));
    }
}
