import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    computed,
    inject,
    input,
    signal,
    viewChild,
} from '@angular/core';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableSelectionService } from '../controllers/selections/xm-table-selection.service';
import { XmCheckboxControl } from '@xm-ngx/components/bool';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { takeUntilOnDestroy } from '@xm-ngx/operators';
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
        <ng-container [matColumnDef]="column().name" [sticky]="column().sticky">
            <th
                *matHeaderCellDef
                scope="col"
                mat-header-cell
                [width]="column().width"
                [class]="column().headClass"
                [style]="column().headStyle">
                <mat-checkbox
                    (change)="$event ? allToggle() : null"
                    (click)="$event.stopPropagation()"
                    class="select-table-column__single-line-height"
                    [disabled]="disabled()"
                    [indeterminate]="isUserIndeterminated()"
                    [checked]="isUserChecked()">
                </mat-checkbox>
            </th>
            <td
                *matCellDef="let row"
                mat-cell
                [width]="column().width"
                [class]="column().dataClass"
                [style]="column().dataStyle">
                <xm-checkbox-control
                    [value]="selectedUser(row)"
                    [disabled]="disabled()"
                    class="select-table-column__single-line-height"
                    (valueChange)="toggleUser($event, row)">
                </xm-checkbox-control>
            </td>
        </ng-container>
    `,
    styles: [`
        .select-table-column__single-line-height { overflow: initial; }
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
export class XmTableUserSelectionColumnComponent<T extends HasUserKey = XmUser> implements OnInit, AfterViewInit, OnDestroy {

    public selection!: SelectionModel<T>;

    public readonly rows = input<T[]>([]);
    public readonly disabled = input<boolean>(false);
    public readonly column = input.required<XmTableSelectTableColumn>();
    public readonly config = input<XmTableSelectionConfig>(XmTableSelectionDefault as XmTableSelectionConfig);

    private readonly _columnDef = viewChild.required(CdkColumnDef);
    private readonly _cell = viewChild.required(CdkCellDef);
    private readonly _headerCell = viewChild.required(CdkHeaderCellDef);

    private readonly selectionService: XmTableSelectionService<T> = inject(XmTableSelectionService);
    private readonly _table = inject(CdkTable) as CdkTable<T>;

    private readonly _selectionVersion = signal(0);

    public ngOnInit(): void {
        this.selection = this.config().useMultipleSelectionModels
            ? this.selectionService.getSelectionModel(this.config().key)
            : this.selectionService.selection;

        this.selectionService.push(this.config().key, this.selection);

        this.selection.changed
            .pipe(takeUntilOnDestroy(this))
            .subscribe(() => this._selectionVersion.update(n => n + 1));

        this.selectionService
            .get(this.config().key)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((v: SelectionModel<any>) => {
                this.selection = v as SelectionModel<T>;
                v.changed
                    .pipe(takeUntilOnDestroy(this))
                    .subscribe(() => this._selectionVersion.update(n => n + 1));
            });
    }

    public ngAfterViewInit(): void {
        const colDef = this._columnDef();
        colDef.name = this.column().name;
        colDef.cell = this._cell();
        colDef.headerCell = this._headerCell();
        this._table.addColumnDef(colDef);
    }

    public allToggle(): void {
        const rows = this.rows();
        const selectedKeys = this.selection.selected.map(sel => sel.userKey);
        const rowKeys = rows.map(row => row.userKey);
        const allSelected =
            this.selection.selected.filter(sel => rowKeys.includes(sel.userKey)).length === rows.length;

        if (allSelected) {
            this.deselectAll();
        } else {
            rows
                ?.filter(row => !selectedKeys.includes(row.userKey))
                .forEach(row => this.selection.select(row));
        }
    }

    public selectedUser(row: T): boolean {
        return this.selection.selected.some(sel => sel.userKey === row.userKey);
    }

    public readonly isUserChecked = computed<boolean>(() => {
        this._selectionVersion();
        const rows = this.rows();
        const selectedRows = this.selection.selected.filter(sel =>
            rows.some(r => r.userKey === sel.userKey),
        );
        return selectedRows.length !== 0 && selectedRows.length === rows.length;
    });

    public readonly isUserIndeterminated = computed<boolean>(() => {
        this._selectionVersion();
        const rows = this.rows();
        const selectedRows = this.selection.selected.filter(sel =>
            rows.some(r => r.userKey === sel.userKey),
        );
        return selectedRows.length !== 0 && selectedRows.length !== rows.length;
    });

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
        this._table.removeColumnDef(this._columnDef());
        this.selectionService.clear(this.column().selectionKey);
        this.selectionService.clear(this.config().key);
        this.deselectAll();
    }

    private deselectAll(): void {
        const rows = this.rows();
        rows.forEach(row => {
            const foundSelection = this.selection.selected.find(sel => sel.userKey === row.userKey);
            if (foundSelection) {
                this.selection.deselect(foundSelection);
            }
        });
    }
}
