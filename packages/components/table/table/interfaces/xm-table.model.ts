import { FormGroupLayoutItem } from '@xm-ngx/components/form-layout';
import { JavascriptCode } from '@xm-ngx/shared/interfaces';
import { Translate } from '@xm-ngx/translation';
import {
    XmTableRepositoryCollectionConfig
} from '../controllers/collections/xm-table-read-only-repository-collection-controller';
import {
    PAGEABLE_AND_SORTABLE_DEFAULT,
    PageableAndSortable
} from '@xm-ngx/components/entity-collection/i-entity-collection-pageable';
import { DEFAULT_NO_ROWS_CONFIG, XmTableEmptyRows } from '../components/table-empty/xm-table-empty.component';

export interface XmTableConfig {
    /** Title */
    title: Translate,
    /** Filters configuration */
    filters: FormGroupLayoutItem[],
    /** Actions configuration */
    actions: XmTableAction[],
    /** Selection configuration */
    selection: XmTableAction[],
    /** Columns configuration */
    columns: XmTableColumn[],
    collection: {
        type: string | null,
        repository: XmTableRepositoryCollectionConfig | null;
    },
    pageableAndSortable: PageableAndSortable,
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

export interface XmTableColumn {
    name: string;// temporary, backward compatibility
    field: string;// temporary, backward compatibility
    //key: string, // Column identifier to use in another part of configuration
    title: Translate, // Column name
    tooltip: Translate, //Column tooltip
    //wordWrap?: boolean; //- true allow word wrap in column header and cells
    //fixedWrap?: boolean; //- Columns with dynamic wirth based on the content by default. But with this conf table column could be fixed width
    //type: string | number | boolean | 'date' | 'enum', // cell content type
    //dataType?: 'path' | 'jsonPath' | 'function', // data selection type
    data: string | JavascriptCode, // value based on [dataType]
    selector: string, //component name that will be used for cell processing
    sortable: boolean, // true if column sortable
    sticky: boolean, // true if column sticky
    stickyEnd: boolean
    selectable: boolean, //- true if column selectable
    //inlineEdit?: boolean, //-true if cells should allow inline editing. Column components could provide inline edition feature optionally
    showByDefault: boolean, //- true if column should be shown by default when column selectable
    // options: {
    //     absoluteLink: string,
    //     routerLink: string,
    //     typeKey: string,
    //     format: string,
    //     dataType: string,
    //     data: string,
    //     component: string,
    //     items: {title: Translate, value: unknown}[],
    // } | unknown
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
    pageableAndSortable: PAGEABLE_AND_SORTABLE_DEFAULT,

    // dataSource: null,
    // options: null,
    // page: { pageSizeOptions: [5, 10, 25] },
};

