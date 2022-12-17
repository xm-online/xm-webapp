import { Translate } from '@xm-ngx/translation';
import {JavascriptCode} from '@xm-ngx/shared/interfaces';

export interface XmTableConfig {
    title: Translate, //Table title
    dataSource: TableDatasource, //Table data source specification
    columns: Array<TableColumn>, //Columns configuration
    filters: TableFilter[], // Filters configuration
    options: TableOptions, // Table configuration
    actions: TableActions, // Actions configuration
    pagination: TablePagination // Pagination configuration
}


export interface TableDatasource {
    /* data source type
    *  STATIC - in case when data defined in [data] field (default)
    *  OBJECT - in case when data will be used from the shared object [path] will define data location object
    *  ENTITY - in case when data will come from entity microservice
    *  TMF-API - in case when data will come from microservice based on the TMForum API specification
    *  API - in case when data will come from some microservices and API path provided.
    * */
   type: 'STATIC' | 'OBJECT' | 'ENTITY' | 'TMF-API' | 'API',
    options?: {
        data?: [], //Array with data (type: STATIC)
        path?: string, //Object path with data location (type: OBJECT)
        typeKey?: string, // entity typeKey (type: ENTITY)
        initialQuery?: string, // Elastic search initial query (type: ENTITY)
        apiPath?: string// API Path (type: TMF-API | API)
    }
}

export interface TableColumn {
    field: string;
    // temporary
    key: string, // Column identifier to use in another part of configuration
    title: Translate, // Column name
    tooltip?: Translate, //Column tooltip
    wordWrap?: boolean; //- true allow word wrap in column header and cells
    fixedWrap?: boolean; //- Columns with dynamic wirth based on the content by default. But with this conf table column could be fixed width
    type: string | number | boolean | 'date' | 'enum', // cell content type
    dataType?: 'path' | 'jsonPath' | 'function', // data selection type
    data?: string | JavascriptCode, // value based on [dataType]
    selector?: string, //component name that will be used for cell processing
    sortable?: boolean, // true if column sortable
    sticky?: boolean, // true if column sticky
    stickyEnd?: boolean
    selectable?: boolean, //- true if column selectable
    inlineEdit?: boolean, //-true if cells should allow inline editing. Column components could provide inline edition feature optionally
    showByDefault?: boolean, //- true if column should be shown by default when column selectable
    options?: {
        absoluteLink: string,
        routerLink: string,
        typeKey: string,
        format: string,
        dataType: string,
        data: string,
        component: string,
        items: {title: Translate, value: unknown}[],
    } | unknown

    // current realisation
    optional?: boolean
}

export interface TableFilter {
    title?: Translate, //filter title
    component?: string, // Component name for filter processing
    query?: string // Elastic Search query template
    columnRef?: string // Reference to the column key. In this case title and other attributes will be used from column configuration
    hint?: Translate, //filter hint title
    options?: unknown
}

export interface TableOptions {
    sortBy: string, // default fields for sorting
    sortDirection: 'desc' | 'asc', // default sorting direction
    selectableRows: boolean, // true to allow checkboxes for row
    noRows: {
        initial: EmptyTableConfig, // case , when table initially loaded empty
        filter: EmptyTableConfig // case, when table filtered empty
    }
}

export interface EmptyTableConfig {
    image: string,
    message: Translate
}

export interface TableActions {
    forOne: ActionComponent[],
    forGroup: ActionComponent[],
    forAll: ActionComponent[]
}

export interface ActionComponent {
    component: string,
    inline: boolean,
    icon: string,
    options: unknown
}

export interface TablePagination {
    pageSizeOptions: number[];
}



