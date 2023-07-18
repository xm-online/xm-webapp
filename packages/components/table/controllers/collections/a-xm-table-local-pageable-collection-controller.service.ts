import { assign, cloneDeep, indexOf } from 'lodash';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/repositories';
import { XmFilterQueryParams, IXmTableCollectionController } from './i-xm-table-collection-controller';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';

export abstract class AXmTableLocalPageableCollectionController<T>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {

    protected set items(value: T[]) {
        this.changeByItems(value);
    }

    protected get items(): T[] {
        return this.state().items;
    }

    public changeByItems(items: T[], pageableAndSortable: PageableAndSortable = null): void {
        if (pageableAndSortable == null) {
            pageableAndSortable = cloneDeep(PAGEABLE_AND_SORTABLE_DEFAULT);
            pageableAndSortable.total = items.length;
            pageableAndSortable.pageSize = items.length;
        }

        this._state.next({
            items: cloneDeep(items),
            error: null,
            loading: false,
            pageableAndSortable: {
                pageIndex: pageableAndSortable.pageIndex,
                pageSize: pageableAndSortable.pageSize,
                total: pageableAndSortable.total,
                sortOrder: pageableAndSortable.sortOrder,
                sortBy: pageableAndSortable.sortBy,
            },
        });
    }

    public add(item: T): void {
        const list = this.items;
        list.push(item);
        this.items = list;
    }

    public edit(prev: T, curr: T): void {
        const items = this.items;
        const i = indexOf(items, prev);
        if (i !== -1) {
            assign(items[i], curr);
            this.items = items;
        } else
            throw new Error('Invalid index.');
    }

    public abstract load(request: XmFilterQueryParams): void ;

    public remove(item: T): void {
        this.items = this.items.filter((i) => i !== item);
    }

    public reset(): void {
        this.load(null);
    }

    public abstract save(): void ;

}
