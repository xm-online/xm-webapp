import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableSelectionService } from '../controllers/selections/xm-table-selection.service';
import { XmCheckboxControl } from '@xm-ngx/components/bool';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Defaults, takeUntilOnDestroy } from '@xm-ngx/operators';
import { XmTableSelectionConfig } from '../table-widget/xm-table-widget.config';
import { XmTableSelectionDefault } from './selection-header/xm-table-selection.model';
import { XmUser } from '@xm-ngx/core/user';

export interface HasUserKey {
    userKey?: string;
}

export interface XmTableSelectTableColumn extends XmTableColumn {
    width: string;
    selectionKey: string;
}

@Component({
    selector: 'xm-table-user-selection-column',
    template: `
        <ng-container [matColumnDef]="column.name" [sticky]="column.sticky">
            <th *matHeaderCellDef
                scope="col"
                mat-header-cell
                [width]="column.width"
                [class]="column.headClass"
                [style]="column.headStyle">
                <mat-checkbox
                    (change)="$event ? allToggle() : null"
                    (click)="$event.stopPropagation()"
                    class="select-table-column__single-line-height"
                    [disabled]="disabled"
                    [indeterminate]="isUserIndeterminated(rows)"
                    [checked]="isUserChecked(rows)">
                </mat-checkbox>
            </th>
            <td
                *matCellDef="let row"
                mat-cell
                [width]="column.width"
                [class]="column.dataClass"
                [style]="column.dataStyle">
                <xm-checkbox-control
                    [value]="selectedUser(row)"
                    [disabled]="disabled"
                    class="select-table-column__single-line-height"
                    (valueChange)="toggleUser($event, row)">
                </xm-checkbox-control>
            </td>
        </ng-container>
    `,
    styles: [`
        .select-table-column__single-line-height {
            overflow: initial;
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [
        XmCheckboxControl,
        MatCheckboxModule,
        MatTableModule,
        CommonModule,
    ],
})
export class XmTableUserSelectionColumnComponent<T extends HasUserKey = XmUser> implements OnInit, OnDestroy {
    public selection!: SelectionModel<T>;

    @Input() public rows: T[] = [];
    @Input() public disabled = false;
    @Input() public column!: XmTableSelectTableColumn;
    @Defaults(XmTableSelectionDefault)
    @Input() public config!: XmTableSelectionConfig;

    @ViewChild(CdkColumnDef, {static: true}) private readonly _columnDef!: CdkColumnDef;
    @ViewChild(CdkCellDef, {static: true}) private readonly _cell!: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, {static: true}) private readonly _headerCell!: CdkHeaderCellDef;

    private selectionService: XmTableSelectionService<T> = inject(XmTableSelectionService);

    constructor(@Inject(CdkTable) private _table: CdkTable<T>) {
    }

    public ngOnInit(): void {
        this.selection = this.config.useMultipleSelectionModels
            ? this.selectionService.getSelectionModel(this.config.key)
            : this.selectionService.selection;

        this._columnDef.name = this.column.name;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._table.addColumnDef(this._columnDef);

        this.selectionService.push(this.config.key, this.selection);
        this.selectionService
            .get(this.config?.key)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((v: SelectionModel<any>) => {
                this.selection = v;
            });
    }

    public allToggle(): void {
        const selectedKeys = this.selection.selected.map(sel => sel.userKey);
        const rowKeys = this.rows.map(row => row.userKey);
        const allSelected =
            this.selection.selected.filter(sel => rowKeys.includes(sel.userKey)).length ===
            this.rows.length;

        if (allSelected) {
            this.deselectAll();
        } else {
            this.rows
                ?.filter(row => !selectedKeys.includes(row.userKey))
                .forEach(row => this.selection.select(row));
        }
    }

    public selectedUser(row: T): boolean {
        return this.selection.selected.some(sel => sel.userKey === row.userKey);
    }

    public isUserChecked(rows: T[]): boolean {
        const selectedRows = this.selection.selected.filter(sel =>
            rows.some(r => r.userKey === sel.userKey),
        );
        return selectedRows.length !== 0 && selectedRows.length === rows.length;
    }

    public isUserIndeterminated(rows: T[]): boolean {
        const selectedRows = this.selection.selected.filter(sel =>
            rows.some(r => r.userKey === sel.userKey),
        );
        return selectedRows.length !== 0 && selectedRows.length !== rows.length;
    }

    public toggleUser(event: boolean, row: T): void {
        if (event) {
            const alreadySelected = this.selection.selected.some(sel => sel.userKey === row.userKey);
            if (!alreadySelected) {
                this.selection.select(row);
            }
        } else {
            const foundSelection = this.selection.selected.find(sel => row.userKey === sel.userKey);
            if (foundSelection) {
                this.selection.deselect(foundSelection);
            }
        }
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef);
        this.selectionService.clear(this.column.selectionKey);
        this.selectionService.clear(this.config.key);
        this.deselectAll();
    }

    private deselectAll(): void {
        this.rows.forEach(row => {
            const foundSelection = this.selection.selected.find(sel => row.userKey === sel.userKey);
            if (foundSelection) {
                this.selection.deselect(foundSelection);
            }
        });
    }
}
