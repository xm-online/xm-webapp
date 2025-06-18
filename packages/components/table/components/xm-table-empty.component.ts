import { CDK_TABLE, CdkNoDataRow } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatNoDataRow, MatTableModule } from '@angular/material/table';

import { Defaults } from '@xm-ngx/operators';
import { Translate } from '@xm-ngx/translation';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { XmTableEmptyTypeConfig } from './xm-table-empty-config.model';

export interface TableNoDataRawManager<T extends CdkNoDataRow = CdkNoDataRow> {
    setNoDataRow(columnDef: T): void;
}

export interface XmTableEmptyConfig {
    /** case , when table initially loaded empty */
    initial: XmTableEmptyTypeConfig;
    /** case, when table filtered empty */
    filter: XmTableEmptyTypeConfig;
    /** case, when table is loading data */
    loading: XmTableEmptyTypeConfig;
}

export const XM_TABLE_EMPTY_DEFAULT_CONFIG: XmTableEmptyConfig = {
    filter: {
        image: '',
        message: null,
    },
    initial: {
        image: '',
        message: null,
    },
    loading: {
        image: '../assets/icons/search.svg',
        message: 'global.loading-data',
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
    @Input() @Defaults(XM_TABLE_EMPTY_DEFAULT_CONFIG) public config: XmTableEmptyConfig;
    @ViewChild(MatNoDataRow, {static: true}) public cell: MatNoDataRow;

    constructor(@Inject(CDK_TABLE) protected noDataRowManager: TableNoDataRawManager) {
    }

    @Input()
    public set type(value: 'initial' | 'filter' | 'loading') {
        this.image = this.config[value].image;
        this.text = this.config[value].message;
    }

    public ngOnInit(): void {
        this.noDataRowManager.setNoDataRow(this.cell);
    }
}
