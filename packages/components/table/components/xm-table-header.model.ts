import { XmDynamicPresentationLayout, XmDynamicSelector, XmDynamicWithConfig } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';

export interface XmTableTitleWidgetConfig extends XmDynamicWithConfig {
    selector: XmDynamicSelector;
}

export interface XmTableHeaderConfig {
    actions: XmDynamicPresentationLayout[];
    title: Translate;
    titleIcon?: string;
    columns?: XmTableColumn[];
    titleWidget?: XmTableTitleWidgetConfig;
}

export interface XmTableHeaderController {
    enrichTitle(title: Translate): Translate;
}

