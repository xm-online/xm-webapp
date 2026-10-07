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
import { XmCondition } from '@xm-ngx/pipes';

export const XM_TABLE_EXPANDABLE_COLUMN_NAME = '_expandColumn';

@Component({
    selector: 'xm-table-expandable-row-column',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, XmCondition],
    template: `
        <ng-container
            [matColumnDef]="columnName"
            [sticky]="sticky"
            [stickyEnd]="stickyEnd">
            <th *matHeaderCellDef mat-header-cell
                class="table-expandable-row-column"
                [class.table-expandable-row-column-auto-width]="!!rowCondition"></th>
            <td *matCellDef="let row" mat-cell
                class="table-expandable-row-column"
                [class.table-expandable-row-column-auto-width]="!!rowCondition">
                <button *ngIf="!rowCondition || (rowCondition | xmCondition: row)"
                        mat-icon-button
                        (click)="toggleRow(row, $event)"
                        [attr.aria-expanded]="isExpanded(row)"
                        [attr.aria-label]="isExpanded(row) ? 'Collapse row' : 'Expand row'">
                    <mat-icon>{{ isExpanded(row) ? 'expand_less' : 'expand_more' }}</mat-icon>
                </button>
            </td>
        </ng-container>
    `,
    styles: [`
    .table-expandable-row-column {
        width: 48px;
    }

    /*
     * With a \`rowCondition\` the column shrinks to its content, so when no row
     * matches it all cells stay empty and the column collapses to zero width.
     */
    th.table-expandable-row-column-auto-width,
    td.table-expandable-row-column-auto-width {
        width: 1px;
        padding: 0;
        white-space: nowrap;
    }

    /* Sticky cells overlap the scrolled ones, so they need an opaque background. */
    th.table-expandable-row-column.mat-mdc-table-sticky,
    td.table-expandable-row-column.mat-mdc-table-sticky {
        background-color: var(--mat-table-background-color, #fff);
    }
    `],
})
export class XmTableExpandableRowColumnComponent implements OnInit, OnDestroy {
    public readonly columnName = XM_TABLE_EXPANDABLE_COLUMN_NAME;

    @Input() public expandedRows: Set<unknown> = new Set();
    /**
     * Optional predicate deciding whether a row can be expanded.
     * Evaluated by the `xmCondition` pipe with the row as `context`.
     */
    @Input() public rowCondition: string;
    /** Pins the column to the start (left in LTR) edge of the table. */
    @Input() public sticky: boolean = false;
    /** Pins the column to the end (right in LTR) edge of the table. */
    @Input() public stickyEnd: boolean = false;
    @Output() public rowExpansionChanged = new EventEmitter<void>();

    @ViewChild(CdkColumnDef, { static: true }) private readonly _columnDef: CdkColumnDef;
    @ViewChild(CdkCellDef, { static: true }) private readonly _cell: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, { static: true }) private readonly _headerCell: CdkHeaderCellDef;

    constructor(@Inject(CdkTable) private _table: CdkTable<unknown>) {}

    public ngOnInit(): void {
        this._columnDef.name = this.columnName;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._columnDef.sticky = this.sticky;
        this._columnDef.stickyEnd = this.stickyEnd;
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
