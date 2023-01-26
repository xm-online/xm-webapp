import { CDK_TABLE, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatNoDataRow, MatTableModule } from '@angular/material/table';

import { Defaults } from '@xm-ngx/shared/operators';
import { Translate } from '@xm-ngx/translation';
import { EmptyTableConfig } from '../../interfaces/xm-table.model';
import { NoDataModule } from '@xm-ngx/components/no-data';

export interface TableNoDataRawManager<T extends CdkNoDataRow = CdkNoDataRow> {
    setNoDataRow(columnDef: T): void;
}


export interface XmTableEmptyRows {
    initial: EmptyTableConfig, // case , when table initially loaded empty
    filter: EmptyTableConfig // case, when table filtered empty
}

export const DEFAULT_NO_ROWS_CONFIG: XmTableEmptyRows = {
    filter: {
        image: '',
        message: null,
    },
    initial: {
        image: '',
        message: null,
    },
};


@Component({
    selector: 'xm-table-empty',
    templateUrl: './xm-table-empty.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NoDataModule,
        MatTableModule,
    ],
})
export class XmTableEmptyComponent implements OnInit {
    public image: string;
    public text: Translate;
    @Input() public colspan: number;
    @Input() @Defaults(DEFAULT_NO_ROWS_CONFIG) public config: XmTableEmptyRows;

    @Input()
    public set type(value: 'initial' | 'filter') {
        this.image = this.config[value].image;
        this.text = this.config[value].message;
    }

    constructor(@Inject(CDK_TABLE) protected noDataRowManager: TableNoDataRawManager) {
    }

    @ViewChild(MatNoDataRow, { static: true }) public cell: MatNoDataRow;

    public ngOnInit(): void {
        this.noDataRowManager.setNoDataRow(this.cell);
    }
}
