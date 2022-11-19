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
    key: string, // Column identifier to use in another part of configuration
    title: Translate, // Column name
    tooltip?: Translate, //Column tooltip
    wordWrap?: boolean; // true allow word wrap in column header and cells
    fixedWrap?: boolean; // Columns with dynamic wirth based on the content by default. But with this conf table column could be fixed width
    type: string | number | boolean | 'date' | 'enum', // cell content type
    dataType?: 'path' | 'jsonPath' | 'function', // data selection type
    data?: string | JavascriptCode, // value based on [dataType]
    component?: string, //component name that will be used for cell processing
    sortable?: boolean, // true if column sortable
    sticky?: boolean, // true if column sticky
    selectable?: boolean, // true if column selectable
    inlineEdit?: boolean, //true if cells should allow inline editing. Column components could provide inline edition feature optionally
    showByDefault?: boolean, // true if column should be shown by default when column selectable
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
    selectableRows: true, // true to allow checkboxes for row
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
    forall: ActionComponent[]
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


// export const DEFAULT_TABLE_CONFIG: Partial<XmTableConfig> = {
//     title: {
//         en: 'Table name',
//     },
//     dataSource: {
//         type: 'STATIC',
//         options: {
//             data: [],
//             path: '',
//             typeKey: 'ENTITY-TYPE',
//             initialQuery: 'stateKey:ACTIVE',
//             apiPath: '',
//         },
//     },
//     'columns': [
//         {
//             'key': 'ID',
//             'title': {
//                 'en': 'ID',
//             },
//             'tooltip': {
//                 'en': 'Column tooltip',
//             },
//             'type': 'string',
//             'dataType': 'path',
//             'data': 'id',
//             'component': '@xm-ngx/components/cell-link',
//             'sortable': true,
//             'sticky': true,
//             'selectable': false,
//             'options': {
//                 'absoluteLink': 'https://example.com/path/to',
//                 'routerLink': '/dashboard/path/to',
//             },
//         },
//         {
//             'key': 'NAME',
//             'title': {
//                 'en': 'Name',
//             },
//             'type': 'string',
//             'dataType': 'path',
//             'data': 'data.field',
//             'component': '@xm-ngx/components/cell-default',
//             'sortable': true,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'inlineEdit': true,
//             'options': {},
//         },
//         {
//             'key': 'STATE',
//             'title': {
//                 'en': 'State',
//             },
//             'type': 'string',
//             'dataType': 'path',
//             'data': 'data.field',
//             'component': '@xm-ngx/components/cell-state',
//             'sortable': true,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'options': {
//                 'typeKey': 'ENTITY-TYPE',
//             },
//         },
//         {
//             'key': 'JSONPATH',
//             'title': {
//                 'en': 'JSON Path',
//             },
//             'type': 'date',
//             'dataType': 'jsonPath',
//             'data': '$..birthday',
//             'component': '@xm-ngx/components/cell-default',
//             'sortable': true,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'options': {
//                 'format': 'YYYY-MMN-DD',
//             },
//         },
//         {
//             'key': 'CREATED',
//             'title': {
//                 'en': 'Create by',
//             },
//             'type': 'string',
//             'dataType': 'path',
//             'data': 'createdBy',
//             'component': '@xm-ngx/components/cell-user-key',
//             'sortable': true,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'options': {
//                 'format': '${lastName} ${firstName}',
//             },
//         },
//         {
//             'key': 'FUNCTION',
//             'title': {
//                 'en': 'Function',
//             },
//             'type': 'boolean',
//             'dataType': 'function',
//             'data': 'data.addresses && data.addresses.length > 2',
//             'component': '@xm-ngx/components/cell-default',
//             'sortable': true,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'options': {},
//         },
//         {
//             'key': 'RELATED-ENTITY-NAME',
//             'title': {
//                 'en': 'Create by',
//             },
//             'type': 'string',
//             'dataType': 'path',
//             'data': 'data.entityId',
//             'component': '@xm-ngx/components/cell-related-entity',
//             'sortable': false,
//             'sticky': false,
//             'selectable': true,
//             'showByDefault': true,
//             'options': {
//                 'dataType': 'path',
//                 'data': 'name',
//                 'component': '@xm-ngx/components/cell-default',
//             },
//         },
//     ],
//     'filters': [
//         {
//             'title': {
//                 'en': 'Only Active',
//             },
//             'component': '@xm-ngx/components/filter-fast',
//             'query': 'stateKey: ACTIVE',
//         },
//         {
//             'columnRef': 'ID',
//         },
//         {
//             'title': {
//                 'en': 'Offerings',
//             },
//             'hint': {
//                 'en': 'Use * to mean any symbol',
//             },
//             'component': '@xm-ngx/components/filter-default',
//             'query': "data. productOfferings .name:${entity.data.product ? '(' + entity.data",
//         },
//         {
//             'title': {
//                 'en': 'Phone',
//             },
//             'component': '@xm-ngx/components/filter-default',
//             'query': 'data.phone:${entity.data.phone}',
//             'options': {
//                 'pattern': 'A[@-9]{0,12}$',
//                 'errors': {
//                     'pattern': {
//                         'en': 'Enter only digits',
//                     },
//                 },
//             },
//         },
//         {
//             'title': {
//                 'en': 'Update date',
//             },
//             'component': '@xm-ngx/components/filter-date-range',
//             'query': 'updateDate :${entity.updateDate}',
//             'options': {
//                 'useUtc': true,
//                 'format': 'YYYY-MM-DD',
//                 'firstDayOfWeek': 1,
//                 'inputDisabled': true,
//             },
//         },
//         {
//             'title': {
//                 'en': 'Enumeration',
//             },
//             'component': '@xm-ngx/components/filter-enum',
//             'query': 'data.enum:${entity.data.enum}',
//             'options': {
//                 'showClearButton': true,
//                 'items': [
//                     {
//                         'title': {
//                             'en': 'Name 1',
//                         },
//                         'value': 'VALUE1',
//                     },
//                     {
//                         'title': {
//                             'en': 'Name 2',
//                         },
//                         'value': 'VALUE2',
//                     },
//                 ],
//             },
//         },
//     ],
//     'options': {
//         'sortBy': 'updateDate',
//         'sortDirection': 'desc',
//         'selectableRows': true,
//         'noRows': {
//             'initial': {
//                 'image': 'path/to/image',
//                 'message': {
//                     'en': 'No matching result',
//                 },
//             },
//             'filter': {
//                 'image': 'path/to/image',
//                 'message': {
//                     'en': 'No matching result',
//                 },
//             },
//         },
//     },
//     'actions': {
//         'forOne': [
//             {
//                 'component': '@xm-ngx/components/one-change-state',
//                 'inline': true,
//                 'icon': 'Loop',
//                 'options': {
//                     'typeKey': 'ENTITY-TYPE',
//                 },
//             },
//             {
//                 'component': '@xm-ngx/components/one-edit',
//                 'inline': true,
//                 icon: 'edit',
//                 'options': {},
//             },
//             {
//                 'component': '@xm-ngx/components/one-document-generate',
//                 'inline': true,
//                 'icon': 'description',
//                 'options': {},
//             },
//             {
//                 'component': '@xm-ngx/components/one-delete',
//                 'inline': true,
//                 'icon': 'delete',
//                 'options': {},
//             },
//         ],
//         'forGroup': [
//             {
//                 'component': '@xm-ngx/components/group-change-state',
//                 'inline': true,
//                 'icon': 'Loop',
//                 'options': {
//                     'typeKey': 'ENTITY-TYPE',
//                 },
//             },
//             {
//                 'component': '@xm-ngx/components/group-delete',
//                 'inline': true,
//                 'icon': 'delete',
//                 'options': {},
//             },
//         ],
//         'forall': [
//             {
//                 'component': '@xm-ngx/components/item-add',
//                 'inline': true,
//                 'icon': 'add',
//                 'options': {},
//             },
//             {
//                 'component': '@xm-ngx/components/all-export',
//                 'inline': false,
//                 'icon': 'file_download',
//                 'options': {},
//             },
//             {
//                 'component': '@xm-ngx/components/document-generate',
//                 'inline': true,
//                 'icon': 'description',
//                 'options': {},
//             },
//         ],
//     },
//     'pagination': {
//         'pageSizeOptions': [
//             10,
//             25,
//         ],
//     },
// };
