import { SelectionModel } from '@angular/cdk/collections';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    OnDestroy,
    OnInit,
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
import { switchMap } from 'rxjs/operators';

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
export class XmTableUserSelectionColumnComponent<T extends HasUserKey = XmUser> implements OnInit, AfterViewInit, OnDestroy {
    private readonly selectionService: XmTableSelectionService<T> = inject(XmTableSelectionService);
    private readonly _table = inject(CdkTable) as CdkTable<T>;

    public readonly selection = signal<SelectionModel<T>>(new SelectionModel<T>(true, []));
    public readonly rows = input<T[]>([]);
    public readonly disabled = input<boolean>(false);
    public readonly column = input.required<XmTableSelectTableColumn>();
    public readonly config = input<XmTableSelectionConfig>(XmTableSelectionDefault as XmTableSelectionConfig);

    private readonly _columnDef = viewChild.required(CdkColumnDef);
    private readonly _cell = viewChild.required(CdkCellDef);
    private readonly _headerCell = viewChild.required(CdkHeaderCellDef);


    private readonly _selectedRowsInView = computed(() => {
        const rows = this.rows();
        const selectionModel = this.selection();

        return selectionModel.selected.filter(selectedItem =>
            rows.some(row => row.userKey === selectedItem.userKey)
        );
    });

    public readonly isUserChecked = computed<boolean>(() => {
        const selectedRows = this._selectedRowsInView();
        const rows = this.rows();

        return selectedRows.length !== 0 && selectedRows.length === rows.length;
    });

    public readonly isUserIndeterminated = computed<boolean>(() => {
        const selectedRows = this._selectedRowsInView();
        const rows = this.rows();
        return selectedRows.length !== 0 && selectedRows.length !== rows.length;
    });

    public ngOnInit(): void {
        const initialSelection = this.config().useMultipleSelectionModels
            ? this.selectionService.getSelectionModel(this.config().key)
            : this.selectionService.selection;

        this.selection.set(initialSelection);

        this.selectionService.push(this.config().key, this.selection());

        this.selection().changed
            .pipe(takeUntilOnDestroy(this))
            .subscribe();

        this.selectionService
            .get(this.config().key)
            .pipe(
                switchMap((selectionModel: SelectionModel<any>) => {
                    this.selection.set(selectionModel as SelectionModel<T>);
                    return selectionModel.changed;
                }),
                takeUntilOnDestroy(this)
            )
            .subscribe();
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
        const selectionModel = this.selection();
        if (this.isUserChecked()) {
            this.deselectAll();
        } else {
            selectionModel.select(...rows);
        }
    }

    public selectedUser(row: T): boolean {
        const selectionModel = this.selection();
        return selectionModel.selected.some(selectedItem => selectedItem.userKey === row.userKey);
    }

    public toggleUser(checked: boolean, row: T): void {
        const selectionModel = this.selection();
        const foundSelection = selectionModel.selected.find(selectedItem => row.userKey === selectedItem.userKey);
        if (checked) {
            selectionModel.select(row);
        } else {
            selectionModel.deselect(foundSelection);
        }
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef());
        this.selectionService.clear(this.column().selectionKey);
        this.selectionService.clear(this.config().key);
        this.deselectAll();
    }

    private deselectAll(): void {
        this.selection().clear();
    }
}
