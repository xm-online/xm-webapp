import { XmDynamicPresentationLayout } from '@xm-ngx/dynamic';
import { Translate } from '@xm-ngx/translation';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';

export interface XmTableHeaderConfig {
    actions: XmDynamicPresentationLayout[];
    title: Translate;
    titleIcon: string;
    columns?: XmTableColumn[];
}

export interface XmTableHeaderController {
    enrichTitle(title: Translate): Translate;
}
