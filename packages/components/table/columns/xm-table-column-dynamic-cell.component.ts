import { CDK_TABLE } from '@angular/cdk/table';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatCellDef, MatColumnDef, MatFooterCellDef, MatHeaderCellDef, MatTableModule } from '@angular/material/table';
import { XmTableColumnsManager } from './xm-table-columns-manager';
import { XmDynamicCell, XmDynamicCellModule } from '@xm-ngx/dynamic';
import { Translate, XmTranslationModule } from '@xm-ngx/translation';
import { CommonModule } from '@angular/common';
import { ShowHideColumnsSettingsComponent } from '../cells/show-hide-columns-settings/show-hide-columns-settings.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface XmTableColumn<O = unknown> extends XmDynamicCell<O> {
    name: string;
    sortable: boolean;
    title: Translate;
    dataClass: string;
    dataStyle: string;
    sticky?: boolean;
    stickyEnd?: boolean;
    optional?: boolean;
    storageColumn?: boolean;
    headClass?: string;
    headStyle?: string;
    tooltip?: Translate;
}

@Component({
    selector: 'xm-table-column-dynamic-cell',
    template: `
        <ng-container
            matColumnDef
            [sticky]="column.sticky"
            [stickyEnd]="column.stickyEnd">
            <th *matHeaderCellDef
                scope="col"
                mat-header-cell
                mat-sort-header
                [class]="column.headClass"
                [style]="column.headStyle"
                [matTooltip]="column.tooltip | translate"
                [disabled]="isSortable()">
                {{column.title | translate}}

                  <xm-show-hide-columns-settings *ngIf="column.storageColumn"></xm-show-hide-columns-settings>
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
    imports: [
        CommonModule,
        MatTableModule,
        XmDynamicCellModule,
        XmTranslationModule,
        MatSortModule,
        ShowHideColumnsSettingsComponent,
        MatTooltipModule,
    ],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
/**
 * @beta
 */
export class XmTableColumnDynamicCellComponent implements OnDestroy, OnInit {
    @ViewChild(MatCellDef, { static: true }) public cell: MatCellDef;
    @ViewChild(MatColumnDef, { static: true }) public columnDef: MatColumnDef;
    @ViewChild(MatHeaderCellDef, { static: true }) public headerCell: MatHeaderCellDef;
    @ViewChild(MatFooterCellDef, { static: true }) public footerCell: MatFooterCellDef;

    constructor(@Inject(CDK_TABLE) protected columnsManager: XmTableColumnsManager) {
    }

    protected _column: XmTableColumn;

    public get column(): XmTableColumn {
        return this._column;
    }

    @Input()
    public set column(c: XmTableColumn) {
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
