import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';

import { Translate } from '@xm-ngx/translation';
import {
    XmTableRepositoryCollectionConfig
} from '../controllers/collections/xm-table-read-only-repository-collection-controller';
import { DEFAULT_NO_ROWS_CONFIG, XmTableEmptyRows } from '../components/xm-table-empty.component';
import { XmPresentationLayout } from '@xm-ngx/dynamic';

import { PageableAndSortable, PAGEABLE_AND_SORTABLE_DEFAULT } from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { XmTableColumn } from '@xm-ngx/components/table/columns/xm-table-column-dynamic-cell.component';
import {
    FiltersControlRequestOptions
} from '@xm-ngx/components/table/components/xm-table-filters-control-request.component';
import { XmFormatJsTemplateRecursive } from '@xm-ngx/shared/operators';

export interface XmTableWithColumnDynamicCellOptionsPagination {
    pageSizeOptions: number[],
    hidePagination: boolean
}

export interface XmTableConfigFilters extends FormGroupLayoutItem {
    options: {
        title: Translate,
        elasticType?: string,
        elasticTemplateRequest?: string,
    }
}

export interface XmTableConfig extends FiltersControlRequestOptions {
    /** Title */
    title: Translate,
    /** Actions configuration */
    actions: XmPresentationLayout[],
    /** Selection configuration */
    selection: XmPresentationLayout[],
    /** Columns configuration */
    columns: XmTableColumn[],
    collection: {
        type: string | null,
        paramsToRequest?: XmFormatJsTemplateRecursive,
        repository: XmTableRepositoryCollectionConfig | null;
    },
    pageableAndSortable: PageableAndSortable & XmTableWithColumnDynamicCellOptionsPagination,
    options: XmTableOptions,
    filtersClass?: string,
}

export interface XmTableOptions {
    isRowSelectable: boolean, // true to allow checkboxes for row
    noRows: XmTableEmptyRows
}

export interface XmTableEmptyConfig {
    image: string,
    message: Translate
}

export const XM_TABLE_CONFIG_DEFAULT: XmTableConfig = {
    options: {
        isRowSelectable: false,
        noRows: DEFAULT_NO_ROWS_CONFIG,
    },
    title: null,
    actions: [],
    selection: [],
    filters: [],
    columns: [],
    collection: {
        type: null,
        repository: null,
    },
    pageableAndSortable: {
        ...PAGEABLE_AND_SORTABLE_DEFAULT,
        ...{
            pageSizeOptions: [],
            hidePagination: false,
        },
    },
    filtersClass: 'row',
};

