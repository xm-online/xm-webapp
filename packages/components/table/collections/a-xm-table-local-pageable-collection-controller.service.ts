import _, { assign, cloneDeep, defaultsDeep, indexOf } from 'lodash';
import { PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/repositories';
import { IXmTableCollectionController, XmFilterQueryParams } from './i-xm-table-collection-controller';
import { AXmTableStateCollectionController } from './a-xm-table-state-collection-controller.service';

export abstract class AXmTableLocalPageableCollectionController<T>
    extends AXmTableStateCollectionController<T>
    implements IXmTableCollectionController<T> {


    private rawData: T[];

    protected get items(): T[] {
        return this.state().items;
    }

    protected set items(value: T[]) {
        this.changeByItems(value, null);
    }

    public changeByItems(rawData: T[], request: XmFilterQueryParams): void {
        this.rawData = rawData;
        const queryParams: XmFilterQueryParams = defaultsDeep(
            request,
            cloneDeep({
                pageableAndSortable: PAGEABLE_AND_SORTABLE_DEFAULT,
                filterParams: {},
            }));
        const {sortOrder, sortBy} = queryParams.pageableAndSortable;
        const total = rawData.length;
        const pageSize = Math.min(queryParams.pageableAndSortable.pageSize || total, (total > queryParams.pageableAndSortable.pageSize ? total : queryParams.pageableAndSortable.pageSize));
        const maxPageCount = Math.round(total / (pageSize || 1));
        const maxPageIndex = maxPageCount * pageSize === total
            ? maxPageCount - 1
            : maxPageCount;
        const pageIndex = Math.max(0, Math.min(queryParams.pageableAndSortable.pageIndex, maxPageIndex));

        const expectedFromIndex = pageIndex * pageSize;
        const availableFromIndex = Math.min(expectedFromIndex, total);
        const expectedToIndex = (pageIndex + 1) * pageSize;
        const availableToIndex = Math.min(expectedToIndex, total);
        const orderedItems = _.orderBy(this.rawData, sortBy, sortOrder || 'asc');
        const slicedItems = _.slice(orderedItems, availableFromIndex, availableToIndex);

        this._state.next({
            items: cloneDeep(slicedItems),
            error: null,
            loading: false,
            pageableAndSortable: {
                pageIndex,
                pageSize,
                total,
                sortOrder,
                sortBy,
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
