import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';

import { Translate } from '@xm-ngx/translation';
import {
    XmTableRepositoryCollectionConfig
} from '../controllers/collections/xm-table-read-only-repository-collection-controller';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { DEFAULT_NO_ROWS_CONFIG, XmTableEmptyRows } from '../components/xm-table-empty.component';
import { TableColumn } from '../../column/table-column-dynamic-cell';

export interface XmTableWithColumnDynamicCellOptionsPagination {
    pageSizeOptions: number[],
    hidePagination: boolean
}

export interface XmTableConfig {
    /** Title */
    title: Translate,
    /** Filters configuration */
    filtersToRequest?: any,
    filters: FormGroupLayoutItem[],
    /** Actions configuration */
    actions: XmTableAction[],
    /** Selection configuration */
    selection: XmTableAction[],
    /** Columns configuration */
    columns: TableColumn[],
    collection: {
        type: string | null,
        repository: XmTableRepositoryCollectionConfig | null;
    },
    pageableAndSortable: PageableAndSortable & XmTableWithColumnDynamicCellOptionsPagination,
    options: XmTableOptions,

    // pagination: XmTablePagination // Pagination configuration


    //Table title
    // options: XmTableOptions, // Table configuration
    // dataSource: any,//XmTableDataSource, //Table data source specification
}


export interface XmTableDataSource {
    /* data source type
    *  STATIC - in case when data defined in [data] field (default)
    *  OBJECT - in case when data will be used from the shared object [path] will define data location object
    *  ENTITY - in case when data will come from entity microservice
    *  TMF-API - in case when data will come from microservice based on the TMForum API specification
    *  API - in case when data will come from some microservices and API path provided.
    * */
    type: 'STATIC' | 'OBJECT' | 'ENTITY' | 'TMF-API' | 'API',
    options: {
        data: [], //Array with data (type: STATIC)
        path: string, //Object path with data location (type: OBJECT)
        typeKey: string, // entity typeKey (type: ENTITY)
        initialQuery: string, // Elastic search initial query (type: ENTITY)
        apiPath: string// API Path (type: TMF-API | API)
    }
}

export interface XmTableFilter {
    title?: Translate, //filter title
    component?: string, // Component name for filter processing
    query?: string // Elastic Search query template
    columnRef?: string // Reference to the column key. In this case title and other attributes will be used from column configuration
    hint?: Translate, //filter hint title
    options?: unknown
}

export interface XmTableOptions {
    // sortBy: string, // default fields for sorting
    // sortDirection: 'desc' | 'asc', // default sorting direction
    isRowSelectable: boolean, // true to allow checkboxes for row
    noRows: XmTableEmptyRows
}


export interface EmptyTableConfig {
    image: string,
    message: Translate
}

export interface XmTableAction {
    component: string,
    inline: boolean,
    icon: string,
    options: unknown
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
        ...PAGEABLE_AND_SORTABLE_DEFAULT, ...{
            pageSizeOptions: [],
            hidePagination: false,
        }
    },

    // dataSource: null,
    // options: null,
    // page: { pageSizeOptions: [5, 10, 25] },
};

