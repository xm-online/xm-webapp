import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { NestedKeyFilters } from '@xm-ngx/operators';

export interface KeyFilterController {
    prepareValue?: (value: XmKeyFilterValue, config: XmKeyFilterConfig) => XmKeyFilterValue;
}

export interface XmKeyFilterConfig {
    key?: string;
    filters: NestedKeyFilters;
    propertyPath?: string;
    dynamic?: XmDynamicPresentation;
}

export type XmKeyFilterValue = unknown[];
