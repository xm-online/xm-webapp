import { CDK_TABLE, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatNoDataRow, MatTableModule } from '@angular/material/table';

import { Defaults } from '@xm-ngx/shared/operators';
import { Translate } from '@xm-ngx/translation';
import { XmTableEmptyConfig } from '../interfaces/xm-table.model';
import { NoDataModule } from '@xm-ngx/components/no-data';

export interface TableNoDataRawManager<T extends CdkNoDataRow = CdkNoDataRow> {
    setNoDataRow(columnDef: T): void;
}


export interface XmTableEmptyRows {
    initial: XmTableEmptyConfig, // case , when table initially loaded empty
    filter: XmTableEmptyConfig // case, when table filtered empty
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
    template: `
        <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell"
                [attr.colspan]="colspan">
                <no-data [imageUrl]="image"
                         [show]="true"
                         [text]="text"></no-data>
            </td>
        </tr>
    `,
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
    @ViewChild(MatNoDataRow, { static: true }) public cell: MatNoDataRow;

    constructor(@Inject(CDK_TABLE) protected noDataRowManager: TableNoDataRawManager) {
    }

    @Input()
    public set type(value: 'initial' | 'filter') {
        this.image = this.config[value].image;
        this.text = this.config[value].message;
    }

    public ngOnInit(): void {
        this.noDataRowManager.setNoDataRow(this.cell);
    }
}
