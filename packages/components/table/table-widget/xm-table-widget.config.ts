import { Translate } from '@xm-ngx/translation';
import { PageableAndSortable } from '@xm-ngx/repositories';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from '../directives/xm-table.model';
import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { DEFAULT_NO_ROWS_CONFIG, XmTableEmptyRows } from '../components/xm-table-empty.component';
import { XmTableFiltersControlRequestConfig } from '../components/xm-table-filter-button-dialog-controls.component';

export interface XmTableWithColumnDynamicCellOptionsPagination extends PageableAndSortable {
    pageSizeOptions: number[],
    hidePagination: boolean;
}

export type XmTableQueryParamsToFilter = Record<string, unknown>;

export interface XmTableWidgetConfig extends XmTableConfig, XmTableFiltersControlRequestConfig {
    /** Title */
    title: Translate,
    isRowSelectable: boolean,
    noRows: XmTableEmptyRows,
    /** Actions configuration */
    actions: XmDynamicPresentationLayout[],
    width?: string;
    filtersClass?: string,
    /** Selection configuration */
    selection: XmDynamicPresentationLayout[],
}

export const XM_TABLE_WIDGET_CONFIG_DEFAULT: XmTableWidgetConfig = {
    title: null,
    isRowSelectable: false,
    noRows: DEFAULT_NO_ROWS_CONFIG,
    ...XM_TABLE_CONFIG_DEFAULT,
    filtersClass: 'row',
    filters: [],
    selection: [],
    chips: [],
    actions: [],
};
