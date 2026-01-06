import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, inject, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { XmTableColumn } from '../columns/xm-table-column-dynamic-cell.component';
import { XmTableSelectionService } from '../controllers/selections/xm-table-selection.service';
import { XmCheckboxControl } from '@xm-ngx/components/bool';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Defaults, takeUntilOnDestroy } from '@xm-ngx/operators';
import { XmEntity } from '@xm-ngx/core/entity';
import { XmTableSelectionConfig } from '../table-widget/xm-table-widget.config';
import { IId } from '@xm-ngx/interfaces';
import { XmTableSelectionDefault } from './selection-header/xm-table-selection.model';

export interface XmTableSelectTableColumn extends XmTableColumn {
    width: string;
    selectionKey: string;
}

export const XM_TABLE_SELECTION_COLUMN_DEFAULT: XmTableSelectTableColumn = {
    class: '',
    dataClass: '',
    dataStyle: '',
    headClass: '',
    headStyle: '',
    field: '',
    selector: '',
    sortable: false,
    style: '',
    title: undefined,
    width: '',
    name: '_selectColumn',
    sticky: false,
    selectionKey: '',
};

@Component({
    selector: 'xm-table-selection-column',
    template: `
        <ng-container [matColumnDef]="column.name" [sticky]="column.sticky">
            <th *matHeaderCellDef
                scope="col"
                mat-header-cell
                [width]="column.width"
                [class]="column.headClass"
                [style]="column.headStyle">
                @if (config.isMultiselect) {
                    <mat-checkbox
                        (change)="$event ? allToggle() : null"
                        (click)="$event.stopPropagation()"
                        class="select-table-column__single-line-height"
                        [disabled]="disabled"
                        [indeterminate]="isEntityIndeterminated(rows)"
                        [checked]="isEntityChecked(rows)">
                    </mat-checkbox>
                }
            </th>
            <td
                *matCellDef="let row"
                mat-cell
                [width]="column.width"
                [class]="column.dataClass"
                [style]="column.dataStyle">
                @if (config.isMultiselect) {
                    <xm-checkbox-control
                        [value]="selectedEntity(row)"
                        [disabled]="disabled"
                        class="select-table-column__single-line-height"
                        (valueChange)="toggleEntity($event, row)">
                    </xm-checkbox-control>
                }
                @if (!config.isMultiselect) {
                    <mat-radio-button
                        [checked]="selectedEntity(row)"
                        [disabled]="disabled"
                        class="select-table-column__single-line-height"
                        (change)="toggleEntity($event.source.checked, row)"
                        (click)="$event.stopPropagation()">
                    </mat-radio-button>
                }
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
        XmCheckboxControl,
        MatCheckboxModule,
        MatRadioModule,
        MatTableModule,
        CommonModule,
    ],
})
export class XmTableSelectionColumnComponent<T extends IId> implements OnInit, OnDestroy {
    public selection: SelectionModel<T>;
    @Input() public rows: T[] = [];
    @Input() public disabled: boolean;
    @Input() public column: XmTableSelectTableColumn;
    @Defaults(XmTableSelectionDefault)
    @Input() public config: XmTableSelectionConfig;
    @ViewChild(CdkColumnDef, {static: true}) private readonly _columnDef: CdkColumnDef;
    @ViewChild(CdkCellDef, {static: true}) private readonly _cell: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, {static: true}) private readonly _headerCell: CdkHeaderCellDef;

    private selectionService: XmTableSelectionService<T> = inject(XmTableSelectionService);

    constructor(
        @Inject(CdkTable) private _table: CdkTable<T>,
    ) {
    }

    public ngOnInit(): void {
        const isMultiselect = this.config.isMultiselect !== false;
        this.selection = this.selectionService.getOrCreateSelection(
            this.config.key,
            this.config.useMultipleSelectionModels,
            isMultiselect
        );

        this.initializeColumnDef();
        this.selectionService.push(this.config.key, this.selection);
        this.subscribeToSelectionChanges();
    }

    private initializeColumnDef(): void {
        this._columnDef.name = this.column.name;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._table.addColumnDef(this._columnDef);
    }

    private subscribeToSelectionChanges(): void {
        this.selectionService
            .get(this.config?.key)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((v: SelectionModel<any>) => {
                this.selection = v;
            });
    }

    public allToggle(): void {
        if (this.selection.selected.filter((selection: T) => this.rows.map((row: T) => row.id).includes(selection.id)).length == this.rows.length) {
            this.deselectAll();
        } else {
            this.rows?.filter((row: T) => !this.selection.selected.map((selection: T) => selection.id).includes(row.id))
                .forEach((row) => this.selection.select(row));
        }
    }

    public selectedEntity(row: XmEntity<T>): boolean {
        return this.selection.selected.map((sel: T) => sel.id).includes(row.id);
    }

    public isEntityChecked(rows: XmEntity<T>[]): boolean {
        const selectedRows = this.selection.selected.filter((selection) => rows.map((row) => row.id).includes(selection.id as number));
        return selectedRows.length !== 0 && selectedRows.length == rows.length;
    }

    public isEntityIndeterminated(rows: XmEntity<T>[]): boolean {
        const selectedRows = this.selection.selected.filter((selection) => rows.map((row) => row.id).includes(selection.id as number));
        return selectedRows.length !== 0 && selectedRows.length !== rows.length;
    }

    public toggleEntity(event: boolean, row: T): void {
        if (event) {
            this.selection.select(row);
        } else {
            const foundSelection = this.selection.selected.find((selection: T) => row.id === selection.id);
            this.selection.deselect(foundSelection);
        }
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef);
        this.selectionService.clear(this.column.selectionKey); //TODO: old config, will be remove
        this.selectionService.clear(this.config.key);
        this.deselectAll();
    }

    private deselectAll(): void {
        this.rows.forEach((row: T) => {
            const foundSelection = this.selection.selected.find((selection: T) => row.id === selection.id);
            this.selection.deselect(foundSelection);
        });
    }
}
