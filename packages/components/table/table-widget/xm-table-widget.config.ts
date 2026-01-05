import { Translate } from '@xm-ngx/translation';
import { PageableAndSortable } from '@xm-ngx/repositories';
import { XM_TABLE_CONFIG_DEFAULT, XmTableConfig } from '../directives/xm-table.model';
import { XmDynamicLayout, XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { XM_TABLE_EMPTY_DEFAULT_CONFIG, XmTableEmptyConfig } from '../components/xm-table-empty.component';
import { XmTableFiltersControlRequestConfig } from '../components/xm-table-filter-button-dialog-controls.component';
import { DataQa } from '@xm-ngx/interfaces';

export interface XmTableWithColumnDynamicCellOptionsPagination extends PageableAndSortable {
    pageSizeOptions: number[],
    hidePagination: boolean;
    infinityTotalLimit?: number;
    showFirstLastButtons?: boolean;
}

export interface XmTableQueryParamsFilterValue {
    update: boolean;
    name: string;
}

export type XmTableQueryParamsFilter = Record<string, XmTableQueryParamsFilterValue>;


export interface XmTableWidgetConfig extends XmTableConfig, XmTableFiltersControlRequestConfig, DataQa {
    /** Title */
    title: Translate,
    headerStyle?: string,
    tableWrapperStyle?: string;
    isTitleHidden: boolean;
    isCardMarginBottom: boolean;
    highlightRowOnHover?: boolean;
    highlightRowOnClick?: boolean;
    isRowSelectable: boolean,
    noRows: XmTableEmptyConfig,
    /** Actions configuration */
    actions: XmDynamicPresentationLayout[],
    width?: string;
    filtersClass?: string,
    /** Selection configuration */
    selection?: XmTableSelectionConfig;
    popUpFilter?: boolean;
    showFilterChips?: boolean;
    isStickyHeader?: boolean;
}

export interface XmTableSelectionConfig {
    controller?: {
        key: string
    };
    pageSize?: number;
    key?: string;
    menuMode?: boolean;
    layout?: XmDynamicLayout[];
    useMultipleSelectionModels?: boolean;
    selectAllWithoutLayouts?: boolean;
    isUserSelection?: boolean;
    isMultiselect?: boolean;
}

export const XM_TABLE_WIDGET_CONFIG_DEFAULT: XmTableWidgetConfig = {
    title: null,
    isTitleHidden: false,
    isCardMarginBottom: true,
    isRowSelectable: false,
    highlightRowOnHover: false,
    noRows: XM_TABLE_EMPTY_DEFAULT_CONFIG,
    ...XM_TABLE_CONFIG_DEFAULT,
    filtersClass: 'row',
    filters: [],
    chips: [],
    actions: [],
    popUpFilter: false,
    showFilterChips: true,
    dataQa: 'default-xm-table-data-qa',
};
