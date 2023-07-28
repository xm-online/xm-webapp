import { Directive, Input } from '@angular/core';
import { XmTableSelectionService } from '../controllers/selections/xm-table-selection.service';

import {
    XM_TABLE_SELECTION_COLUMN_DEFAULT,
    XmTableSelectTableColumn,
} from '../components/xm-table-selection-column.component';
import _ from 'lodash';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableConfig } from './xm-table.model';

const SELECT_COLUMN_KEY = '_selectColumn';

@Directive({
    selector: '[xmTableSelection]',
    exportAs: 'xmTableSelection',
    providers: [
        XmTableSelectionService,
    ],
    standalone: true,
})
export class XmTableSelectionDirective {
    @Input('xmTableSelectionConfig')
    public config: XmTableConfig;

    public get selectColumn(): XmTableSelectTableColumn {
        const overrideConfig = this.config.columns.find(c => c.name == SELECT_COLUMN_KEY) as XmTableSelectTableColumn || null;
        const defaultConfig = _.cloneDeep(XM_TABLE_SELECTION_COLUMN_DEFAULT);
        return overrideConfig ?? defaultConfig;
    }

    public get dynamicColumns(): XmTableColumn[] {
        return this.config.columns.filter(c => c.name != SELECT_COLUMN_KEY);
    }
}
