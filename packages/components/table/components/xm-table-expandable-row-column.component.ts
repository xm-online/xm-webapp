import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

export const XM_TABLE_EXPANDABLE_COLUMN_NAME = '_expandColumn';

@Component({
    selector: 'xm-table-expandable-row-column',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
    template: `
        <ng-container [matColumnDef]="columnName">
            <th *matHeaderCellDef mat-header-cell class="table-expandable-row-column"></th>
            <td *matCellDef="let row" mat-cell class="table-expandable-row-column">
                <button mat-icon-button
                        (click)="toggleRow(row, $event)"
                        [attr.aria-expanded]="isExpanded(row)"
                        aria-label="Expand row">
                    <mat-icon>{{ isExpanded(row) ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>
            </td>
        </ng-container>
    `,
    styles: [`
    .table-expandable-row-column {
        width: 48px;
    }
    `]
})
export class XmTableExpandableRowColumnComponent implements OnInit, OnDestroy {
    public readonly columnName = XM_TABLE_EXPANDABLE_COLUMN_NAME;

    @Input() public expandedRows: Set<unknown> = new Set();
    @Output() public rowExpansionChanged = new EventEmitter<void>();

    @ViewChild(CdkColumnDef, { static: true }) private readonly _columnDef: CdkColumnDef;
    @ViewChild(CdkCellDef, { static: true }) private readonly _cell: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, { static: true }) private readonly _headerCell: CdkHeaderCellDef;

    constructor(@Inject(CdkTable) private _table: CdkTable<unknown>) {}

    public ngOnInit(): void {
        this._columnDef.name = this.columnName;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._table.addColumnDef(this._columnDef);
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef);
    }

    public toggleRow(row: unknown, event: MouseEvent): void {
        event.stopPropagation();
        if (this.expandedRows.has(row)) {
            this.expandedRows.delete(row);
        } else {
            this.expandedRows.add(row);
        }
        this.rowExpansionChanged.emit();
    }

    public isExpanded(row: unknown): boolean {
        return this.expandedRows.has(row);
    }
}
