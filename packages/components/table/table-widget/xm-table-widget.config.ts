import { Translate } from '@xm-ngx/translation';
import { DEFAULT_NO_ROWS_CONFIG, XmTableEmptyRows } from '../components/xm-table-empty.component';
import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';

import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable,
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmTableColumn } from '@xm-ngx/components/table/columns/xm-table-column-dynamic-cell.component';
import {
    XmTableFiltersControlRequestConfig,
} from '@xm-ngx/components/table/components/xm-table-filters-control-request.component';
import {
    XmTableCollectionControllerType,
} from '@xm-ngx/components/table/controllers/collections/xm-table-collection-controller-resolver.service';

export interface XmTableWithColumnDynamicCellOptionsPagination extends PageableAndSortable {
    pageSizeOptions: number[],
    hidePagination: boolean;
}

export interface XmTableWidgetConfig extends XmTableFiltersControlRequestConfig {
    /** Title */
    title: Translate,
    /** Actions configuration */
    actions: XmDynamicPresentationLayout[],
    /** Selection configuration */
    selection: XmDynamicPresentationLayout[],
    /** Columns configuration */
    columns: XmTableColumn[],
    collection: XmTableCollectionControllerType,
    pageableAndSortable: XmTableWithColumnDynamicCellOptionsPagination,
    isRowSelectable: boolean,
    noRows: XmTableEmptyRows,
    width?: string;
    filtersClass?: string,
}

export const XM_TABLE_CONFIG_DEFAULT: XmTableWidgetConfig = {
    isRowSelectable: false,
    noRows: DEFAULT_NO_ROWS_CONFIG,
    title: null,
    actions: [],
    selection: [],
    filters: [],
    columns: [],
    collection: null,
    pageableAndSortable: {
        ...PAGEABLE_AND_SORTABLE_DEFAULT,
        ...{
            pageSizeOptions: [],
            hidePagination: false,
        },
    },
    filtersClass: 'row',
};
