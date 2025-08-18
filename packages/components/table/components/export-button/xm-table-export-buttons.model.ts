import { Translate } from '@xm-ngx/translation';
import { JavascriptCode } from '@xm-ngx/interfaces';
import { XmTableColumn } from '../../columns/xm-table-column-dynamic-cell.component';

export type ExportButtonConfig = {
    title?: Translate;
    icon?: string;
    class?: string;
    style?: string;
    valueKey?: string;
    asIcon?: boolean;
    permissions?: string[];
    showCondition?: JavascriptCode;
    disableCondition?: JavascriptCode;
    controller?: XmTableExportButtonControllerConfig;
    loadingController?: XmTableExportButtonControllerConfig;
    dataQa: string;
    columns?: XmTableColumn[];
    export?: ExportParamsButtonConfig;
    pageSize?: number;
}

export enum ExportType {
    XLS = 'xls',
    XLSX = 'xlsx',
    CSV = 'csv',
    TXT = 'txt',
}

export interface XmTableExportButtonControllerConfig {
    key?: string;
    method?: string;
}

export interface ExportParamsButtonConfig {
    type?: ExportType;
    name?: string;
    delimiter?: string;
    additionalFields?: XmTableColumn[];
}

export const XmTableExportButtonConfigDefault = {
    export: {
        type: ExportType.CSV,
        fileName: 'table_data',
        delimiter: ';',
        additionalFields: [],
    },
    pageSize: 1000,
    controller: {
        key: 'export-action-controller',
        method: 'export'
    },
    loadingController: {
        key: 'export-action-controller',
        method: 'loading'
    }
};
