import { Translate } from '@xm-ngx/translation';
import { HintText } from '@xm-ngx/components/hint';
import { XmTableColumnDynamicCellsOptions } from '@xm-ngx/components/table';
import { XmFormatTemplateRecursive } from '@xm-ngx/operators';
import { XmControlErrorsTranslates } from '@xm-ngx/components/control-error';
import { TooltipPosition } from '@angular/material/tooltip';

export interface XmAutocompleteControlMapper {
    // Interpolated string as ${name}
    displayFn: string;
    valueByKey: string | object;
}

export type XmAutocompleteControlParams = Record<string, string>;
export type XmAutocompleteControlBody = Record<string, string>;

export interface XmAutocompleteControlListItem {
    value: unknown;
    view: string;
    data: unknown;
}

export interface XmAutocompleteControlConfig {
    hint?: HintText;
    title?: Translate;
    placeholder?: Translate;
    search: XmAutocompleteSearchParams;
    fetchSelectedByCriteria: XmAutocompleteFetchParams;
    multiple: boolean;
    startEmptySearch?: boolean;
    extractByKey?: string;
    compareMap: XmFormatTemplateRecursive;
    itemMapper: XmAutocompleteControlMapper;
    formatBackendData: object;
    pickIntersectSelected?: boolean;
    skipFetchSelected?: boolean;
    valueAsJson?: boolean;
    columns: XmTableColumnDynamicCellsOptions[];
    height: number;
    searchPlaceholder?: Translate;
    notFoundSearchPlaceholder?: Translate;
    deselectText?: Translate;
    startFromCharSearch?: number;
    errors?: XmControlErrorsTranslates;
    required?: boolean;
    useTooltip?: boolean;
    tooltipPosition?: TooltipPosition;
    controller?: {
        key?: string;
        method?: string;
    },
    skipByKeyValue?: { [key: string]: unknown },
    changeValueOnEmptySelected?: boolean;
}

export interface XmAutocompleteSearchParams {
    resourceUrl: string;
    resourceMethod: string;
    queryParams: XmAutocompleteControlParams;
    body: XmAutocompleteControlBody;
    headers: Record<string, string>;
}

export interface XmAutocompleteFetchParams {
    body: XmAutocompleteControlParams;
    queryParams: XmAutocompleteControlParams;
}

export const AUTOCOMPLETE_CONTROL_DEFAULT_CONFIG: XmAutocompleteControlConfig = {
    hint: null,
    title: '',
    search: {
        resourceUrl: null,
        resourceMethod: 'GET',
        queryParams: {},
        body: {},
        headers: {},
    },
    fetchSelectedByCriteria: {
        queryParams: {},
        body: {},
    },
    startEmptySearch: true,
    pickIntersectSelected: false,
    skipFetchSelected: false,
    multiple: false,
    valueAsJson: false,
    extractByKey: null,
    compareMap: null,
    itemMapper: {
        displayFn: '${name}',
        valueByKey: '${name}',
    },
    formatBackendData: null,
    columns: [],
    height: 400,
    searchPlaceholder: 'global.rest-select-placeholder-search.simple',
    notFoundSearchPlaceholder: 'global.rest-select-placeholder-noresults',
    startFromCharSearch: 0,
    required: false,
    useTooltip: false,
    tooltipPosition: 'below',
};
