import {CDK_TABLE} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
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
import {MatSortModule} from '@angular/material/sort';
import {MatCellDef, MatColumnDef, MatFooterCellDef, MatHeaderCellDef, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {XmDynamicCellModule} from '@xm-ngx/dynamic';
import {XmTranslationModule} from '@xm-ngx/translation';
import {TableColumn} from './table-column-dynamic-cell';
import {TableColumnsManager} from './table-columns-manager';

@Component({
    selector: 'xm-mat-table-column-dynamic-cell',
    template: `
        <ng-container
            matColumnDef
            [sticky]="column.sticky"
            [stickyEnd]="column.stickyEnd">
            <th *matHeaderCellDef
                mat-header-cell
                mat-sort-header
                [matTooltip]="(column.tooltip || column.name) | translate"
                [class]="column.headClass"
                [style]="column.headStyle"
                [disabled]="isSortable()">
                {{column.title | translate}}
            </th>
            <td mat-cell
                *matCellDef="let value"
                [class]="column.dataClass"
                [style]="column.dataStyle">
                <ng-container xmDynamicCell
                              [row]="value"
                              [cell]="column"></ng-container>
            </td>
        </ng-container>
    `,
    styles: ['th, td{padding:0 16px}', 'th{font-weight: bold; text-align:center}'],
    changeDetection: ChangeDetectionStrategy.Default,
})
/**
 * @beta
 */
export class XmMatTableColumnDynamicCell implements OnDestroy, OnInit {
    @ViewChild(MatCellDef, {static: true}) public cell: MatCellDef;
    @ViewChild(MatColumnDef, {static: true}) public columnDef: MatColumnDef;
    @ViewChild(MatHeaderCellDef, {static: true}) public headerCell: MatHeaderCellDef;
    @ViewChild(MatFooterCellDef, {static: true}) public footerCell: MatFooterCellDef;

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
            this.columnDef.name = this._column.name || this._column.field;
        }
    }
}

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        XmDynamicCellModule,
        XmTranslationModule,
        MatSortModule,
        MatTooltipModule,
    ],
    exports: [XmMatTableColumnDynamicCell],
    declarations: [XmMatTableColumnDynamicCell],
})
export class XmMatTableColumnDynamicCellModule {
}
