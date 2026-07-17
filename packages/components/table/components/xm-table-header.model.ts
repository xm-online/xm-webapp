import { XmDynamicPresentationLayout, XmDynamicSelector, XmDynamicWithConfig } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import { XmEventManagerKey } from '@xm-ngx/core';

export interface XmTableTitleWidgetConfig extends XmDynamicWithConfig {
    selector: XmDynamicSelector;
}

export interface XmTableHeaderConfig {
    actions: XmDynamicPresentationLayout[];
    title: Translate;
    titleIcon?: string;
    columns?: XmTableColumn[];
    titleWidget?: XmTableTitleWidgetConfig;
    triggerTableKey?: string;
    tableUpdateEvents?: XmEventManagerKey[];
}

export interface XmTableHeaderController {
    enrichTitle(title: Translate): Translate;
}

