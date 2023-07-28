import _, { assign, cloneDeep, defaultsDeep, indexOf } from 'lodash';
import { PAGEABLE_AND_SORTABLE_DEFAULT, } from '@xm-ngx/repositories';
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
        let { pageableAndSortable } = defaultsDeep(request, cloneDeep({ pageableAndSortable: PAGEABLE_AND_SORTABLE_DEFAULT, filterParams: {}}));
        pageableAndSortable.total = rawData.length;

        const from = pageableAndSortable.pageIndex * pageableAndSortable.pageSize;
        const maxLast = (pageableAndSortable.pageIndex + 1) * pageableAndSortable.pageSize;
        const to = maxLast > pageableAndSortable.total ? pageableAndSortable.total : maxLast;
        const items = _.slice(this.rawData, from, to - 1);

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
