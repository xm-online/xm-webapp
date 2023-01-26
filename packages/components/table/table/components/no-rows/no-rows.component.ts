import { CDK_TABLE, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatNoDataRow } from '@angular/material/table';
import { EmptyRows, EmptyTableConfig } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { Defaults } from '@xm-ngx/shared/operators';
import { Translate } from '@xm-ngx/translation';

export interface TableNoDataRawManager<T extends CdkNoDataRow = CdkNoDataRow> {
    setNoDataRow(columnDef: T): void;
}

const DEFAULT_NO_ROWS_CONFIG: EmptyTableConfig = {
    image: '',
    message: null,
};

@Component({
    selector: 'xm-no-rows',
    templateUrl: './no-rows.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoRowsComponent implements OnInit {
    public image: string;
    public text: Translate;
    @Input() public colspan: number;
    @Input() @Defaults(DEFAULT_NO_ROWS_CONFIG) public config: EmptyRows;

    @Input()
    public set type(value: 'initial' | 'filter') {
        this.image = this.config[value]?.image;
        this.text = this.config[value]?.message;
    }

    constructor(@Inject(CDK_TABLE) protected noDataRowManager: TableNoDataRawManager) {
    }

    @ViewChild(MatNoDataRow, { static: true }) public cell: MatNoDataRow;

    public ngOnInit(): void {
        this.noDataRowManager.setNoDataRow(this.cell);
    }
}
