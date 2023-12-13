import {
    XmTableCollectionControllerType
} from '../collections/xm-table-collection-controller-resolver.service';
import { PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/repositories';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import {
    XmTableQueryParamsToFilter,
    XmTableWithColumnDynamicCellOptionsPagination
} from '../table-widget/xm-table-widget.config';

export interface XmTableConfig {
    /** Columns configuration */
    columns: XmTableColumn[],
    collectionKey?: string;
    /** @deprecated use dynamic collection instead */
    collection: XmTableCollectionControllerType,
    queryParamsToFillter?: XmTableQueryParamsToFilter;
    pageableAndSortable: XmTableWithColumnDynamicCellOptionsPagination,
    storageKey: string;
    triggerTableKey: string;
    isCollapsed: boolean;
    isExpandable: boolean;
    showFilterChips?: boolean;
    popUpFilter?: boolean;
}

export const XM_TABLE_CONFIG_DEFAULT: XmTableConfig = {
    columns: [],
    collection: null,
    pageableAndSortable: {
        ...PAGEABLE_AND_SORTABLE_DEFAULT,
        ...{
            pageSizeOptions: [],
            hidePagination: false,
        },
    },
    storageKey: '',
    triggerTableKey: '',
    isCollapsed: false,
    isExpandable: false,
    popUpFilter: false,
    showFilterChips: true,
};

export enum XmTableEventType {
    XM_TABLE_UPDATE = 'XM_TABLE_UPDATE'
}
