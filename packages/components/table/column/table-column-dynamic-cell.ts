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
import { XmDynamicCell, XmDynamicCellModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';

export interface TableColumn<O = unknown> extends XmDynamicCell<O> {
    name: string;
    sortable: boolean;
    title: Translate;
    headerSelector?: string;
    dataClass: string;
    dataStyle: string;
}

@Component({
    selector: 'xm-table-column-dynamic-cell',
    template: `
        <ng-container matColumnDef>
            <th *matHeaderCellDef
                mat-header-cell
                mat-sort-header
                [disabled]="isSortable()">
                <ng-container *ngIf="!!column?.headerSelector; else title"
                              xmDynamicCell
                              [row]="'value'"
                              [column]="columnHeader"></ng-container>
                <ng-template #title>
                    {{column.title | translate}}
                </ng-template>
            </th>
            <td mat-cell
                [class]="column.dataClass"
                [style]="column.dataStyle"
                *matCellDef="let value">
                <ng-container xmDynamicCell
                              [row]="value"
                              [column]="column"></ng-container>
            </td>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.Default,
})
/**
 * @beta
 */
export class TableColumnDynamicCell implements OnDestroy, OnInit {
    @ViewChild(MatCellDef, {static: true}) public cell: MatCellDef;
    @ViewChild(MatColumnDef, {static: true}) public columnDef: MatColumnDef;
    @ViewChild(MatHeaderCellDef, {static: true}) public headerCell: MatHeaderCellDef;
    @ViewChild(MatFooterCellDef, {static: true}) public footerCell: MatFooterCellDef;

    constructor(@Inject(CDK_TABLE) protected columnsManager: TableColumnsManager) {
    }

    protected _column: TableColumn;
    protected _columnHeader: TableColumn;

    public get columnHeader(): TableColumn {
        return this._columnHeader;
    }

    public get column(): TableColumn {
        return this._column;
    }

    @Input()
    public set column(c: TableColumn) {
        this._column = c;
        this._columnHeader = {...this._column, selector: this._column.headerSelector};
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
            this.columnDef.name = this._column.name || this._column.field;
        }
    }
}

@NgModule({
    imports: [
        MatTableModule,
        XmDynamicCellModule,
        XmTranslationModule,
        MatSortModule,
        CommonModule,
    ],
    exports: [TableColumnDynamicCell],
    declarations: [TableColumnDynamicCell],
})
export class TableColumnDynamicCellModule {
}
