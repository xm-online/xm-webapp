import { CDK_TABLE } from '@angular/cdk/table';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatCellDef, MatColumnDef, MatFooterCellDef, MatHeaderCellDef, MatTableModule } from '@angular/material/table';
import { TableColumnsManager } from '@xm-ngx/components/table/column/table-columns-manager';
import { Column, DynamicCellModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';

export interface TableColumn<O = unknown> extends Column<O> {
    sortable: boolean;
    title: Translate;
}

@Component({
    selector: 'xm-table-column-dynamic-cell',
    template: `
        <ng-container matColumnDef>
            <th *matHeaderCellDef
                mat-header-cell
                mat-sort-header
                [disabled]="isSortable()">
                {{column.title | translate}}
            </th>
            <td mat-cell *matCellDef="let value">
                <ng-container xmDynamicCell
                              [row]="value"
                              [column]="column"></ng-container>
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class TableColumnDynamicCell implements OnDestroy, OnInit {
    @ViewChild(MatCellDef, { static: true }) public cell: MatCellDef;
    @ViewChild(MatColumnDef, { static: true }) public columnDef: MatColumnDef;
    @ViewChild(MatHeaderCellDef, { static: true }) public headerCell: MatHeaderCellDef;
    @ViewChild(MatFooterCellDef, { static: true }) public footerCell: MatFooterCellDef;

    constructor(@Inject(CDK_TABLE) protected columnsManager: TableColumnsManager) {
    }

    protected _column: TableColumn;

    public get column(): TableColumn {
        return this._column;
    }

    @Input()
    public set column(c: TableColumn) {
        this._column = c;
    }

    public ngOnInit(): void {
        this._syncColumnDefName();

        this.columnDef.cell = this.cell;
        this.columnDef.headerCell = this.headerCell;
        this.columnDef.footerCell = this.footerCell;
        this.columnsManager.addColumnDef(this.columnDef);
    }

    public ngOnDestroy(): void {
        this.columnsManager.removeColumnDef(this.columnDef);
    }

    public isSortable(): boolean {
        return !this._column.sortable;
    }

    private _syncColumnDefName(): void {
        if (this.columnDef) {
            this.columnDef.name = this._column.field;
        }
    }
}

@NgModule({
    imports: [
        MatTableModule,
        DynamicCellModule,
        XmTranslationModule,
        MatSortModule,
    ],
    exports: [TableColumnDynamicCell],
    declarations: [TableColumnDynamicCell],
})
export class TableColumnDynamicCellModule {
}
