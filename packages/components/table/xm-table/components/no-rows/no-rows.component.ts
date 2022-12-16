import { CDK_TABLE, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatNoDataRow } from '@angular/material/table';
import { EmptyTableConfig } from '@xm-ngx/components/table/xm-table/xm-table.model';
import { Translate } from '@xm-ngx/translation';

export interface TableNoDataRawManager<T extends CdkNoDataRow = CdkNoDataRow> {
    setNoDataRow(columnDef: T): void;
}

@Component({
    selector: 'xm-no-rows',
    templateUrl: './no-rows.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoRowsComponent implements OnInit {
    public image: string;
    public text: Translate;
    @Input() public colspan: number;
    @Input() public config: {
        initial?: EmptyTableConfig,
        filter?: EmptyTableConfig,
    } = {};

    @Input()
    public set type(value: 'initial' | 'filter') {
        this.image = this.config[value]?.image || './assets/images/tobi.svg';
        this.text = this.config[value]?.message || null;
    }

    constructor(@Inject(CDK_TABLE) protected noDataRowManager: TableNoDataRawManager) {
    }

    @ViewChild(MatNoDataRow, { static: true }) public cell: MatNoDataRow;

    public ngOnInit(): void {
        this.noDataRowManager.setNoDataRow(this.cell);
    }
}
