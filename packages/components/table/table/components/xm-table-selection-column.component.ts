import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableColumn } from '../../column/table-column-dynamic-cell';
import { XmTableSelectionService } from '../controllers/selections/xm-table-selection.service';
import { XmCheckboxControlModule } from '@xm-ngx/components/bool';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';

export interface SelectTableColumn extends TableColumn {
    width: string
}

export const XM_TABLE_SELECTION_COLUMN_DEFAULT: SelectTableColumn = {
    class: '',
    dataClass: '',
    dataStyle: '',
    field: '',
    options: undefined,
    selector: '',
    sortable: false,
    style: '',
    title: undefined,
    width: '',
    name: '_selectColumn',
    sticky: false,
};

@Component({
    selector: 'xm-table-selection-column',
    template: `
        <ng-container [matColumnDef]="column.name" [sticky]="column.sticky">
            <th *matHeaderCellDef [width]="column.width" scope="col" mat-header-cell>
                <mat-checkbox (change)="$event ? allToggle() : null"
                              (click)="$event.stopPropagation()"
                              class="select-table-column__single-line-height"
                              [indeterminate]="isRowIndeterminated(rows)"
                              [checked]="isRowChecked(rows)"
                              [disabled]="disabled">
                </mat-checkbox>
            </th>
            <td mat-cell [width]="column.width" *matCellDef="let row">
                <xm-checkbox-control [value]="isRowSelected(row)"
                                     [disabled]="disabled"
                                     class="select-table-column__single-line-height"
                                     (valueChange)="toggleRow($event, row)"></xm-checkbox-control>
            </td>
        </ng-container>
    `,
    styles: [
        `
            .select-table-column__single-line-height {
                overflow: initial;
            }
           `,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        XmCheckboxControlModule,
        MatCheckboxModule,
        MatTableModule,
        NgIf,
    ],
})
export class XmTableSelectionColumnComponent<T> implements OnInit, OnDestroy {
    public selection: SelectionModel<T>;
    @Input() public rows: T[] = [];
    @Input() public disabled: boolean;
    @ViewChild(CdkColumnDef, { static: true }) private readonly _columnDef: CdkColumnDef;
    @ViewChild(CdkCellDef, { static: true }) private readonly _cell: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, { static: true }) private readonly _headerCell: CdkHeaderCellDef;

    constructor(
        @Inject(CdkTable) private _table: CdkTable<T>,
        @Inject(XmTableSelectionService) private _selection: XmTableSelectionService<T>,
    ) {
    }


    @Input() public column: SelectTableColumn;

    public ngOnInit(): void {
        this.selection = this._selection.selection;

        this._columnDef.name = this.column.name;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._table.addColumnDef(this._columnDef);
    }

    public allToggle(): void {
        if (this.selection.selected.filter((selection) => this.rows.includes(selection)).length == this.rows.length) {
            this.rows.forEach((row) => {
                const foundSelection = this.selection.selected.find(r => r == row);
                this.selection.deselect(foundSelection);
            });
        } else {
            this.rows.filter((row) => !this.selection.selected.includes(row))
                .forEach((row) => this.selection.select(row));
        }
    }

    public isRowSelected(row: T): boolean {
        return this.selection.selected.includes(row);
    }

    public isRowChecked(rows: T[]): boolean {
        const selectedRows = this.selection.selected.filter((selection: T) => rows.includes(selection));
        return selectedRows.length !== 0 && selectedRows.length == rows.length;
    }

    public isRowIndeterminated(rows: T[]): boolean {
        const selectedRows = this.selection.selected.filter((selection: T) => rows.includes(selection));
        return selectedRows.length !== 0 && selectedRows.length !== rows.length;
    }

    public toggleRow(event: boolean, row: T): void {
        if (event) {
            this.selection.select(row);
        } else {
            this.selection.deselect(row);
        }
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef);
    }
}
