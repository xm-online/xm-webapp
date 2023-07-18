import { CDK_TABLE } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatCellDef, MatColumnDef, MatFooterCellDef, MatHeaderCellDef, MatTableModule } from '@angular/material/table';
import { XmTableColumnsManager } from './xm-table-columns-manager';
import { XmDynamicCell, XmDynamicCellModule, XmDynamicModule } from '@xm-ngx/dynamic';
import * as _ from 'lodash';
import { XmTextTitleModule } from '@xm-ngx/components/text';


export interface XmTableColumnDynamicCellsOptions {
    /** Unique column name */
    name: string;

    /** Dynamic header cell <th> */
    headClass: string;
    headStyle: string;
    head: {
        class: string;
        style: string;
        sortable: boolean;
        selector: string;
        options: unknown;
        config: unknown;
    },

    /** dynamic body cell <td> */
    bodyClass: string;
    bodyStyle: string;
    body: XmDynamicCell
}


export const XM_TABLE_COLUMN_DYNAMIC_CELLS_OPTIONS_DEFAULT: XmTableColumnDynamicCellsOptions = {
    headClass: '',
    headStyle: '',
    head: {
        options: { title: '' },
        config: { title: '' },
        selector: '@xm-ngx/components/text-title',
        class: '',
        sortable: false,
        style: '',
    },
    bodyClass: '',
    bodyStyle: '',
    body: {
        field: '',
        selector: '',
        options: {},
        class: '',
        style: '',
    },
    name: '',
};

@Component({
    selector: 'xm-table-column-dynamic-cells',
    imports: [
        MatTableModule,
        MatSortModule,
        XmDynamicCellModule,
        XmDynamicModule,
        XmTextTitleModule,
        CommonModule,
    ],
    standalone: true,
    template: `
        <ng-container matColumnDef>

            <ng-template #headerCellRef>
                <th *matHeaderCellDef
                    scope="col"
                    mat-header-cell
                    [class]="column.headClass"
                    [style]="column.headStyle">
                    <ng-container xmDynamicPresentation
                                  [selector]="column.head.selector"
                                  [config]="column.head.config || column.head.options"
                                  [options]="column.head.options"></ng-container>
                </th>
            </ng-template>

            <ng-template #headerCellWithSortingRef>
                <th *matHeaderCellDef
                    scope="col"
                    mat-header-cell
                    mat-sort-header
                    [class]="column.headClass"
                    [style]="column.headStyle">
                    <ng-container xmDynamicPresentation
                                  [selector]="column.head.selector"
                                  [config]="column.head.config || column.head.options"
                                  [options]="column.head.options"></ng-container>
                </th>
            </ng-template>

            <ng-template [ngIf]="column.head.sortable"
                         [ngIfThen]="headerCellWithSortingRef"
                         [ngIfElse]="headerCellRef"></ng-template>

            <td mat-cell
                [class]="column.bodyClass"
                [style]="column.bodyStyle"
                *matCellDef="let value">
                <ng-container xmDynamicCell
                              [row]="value"
                              [cell]="column.body"></ng-container>
            </td>

            <td mat-footer-cell *matFooterCellDef="let value"></td>

        </ng-container>
    `,
})
/**
 * @beta
 */
export class XmTableColumnDynamicCellsComponent {
    @ViewChild(MatCellDef, { static: true }) protected cell: MatCellDef;
    @ViewChild(MatColumnDef, { static: true }) protected columnDef: MatColumnDef;
    @ViewChild(MatHeaderCellDef, { static: true }) protected headerCell: MatHeaderCellDef;
    @ViewChild(MatFooterCellDef, { static: true }) protected footerCell: MatFooterCellDef;

    constructor(@Inject(CDK_TABLE) protected columnsManager: XmTableColumnsManager) {
    }

    protected _column: XmTableColumnDynamicCellsOptions = _.cloneDeep(XM_TABLE_COLUMN_DYNAMIC_CELLS_OPTIONS_DEFAULT);

    public get column(): XmTableColumnDynamicCellsOptions {
        return this._column;
    }

    @Input()
    public set column(c: XmTableColumnDynamicCellsOptions) {
        this._column = _.defaultsDeep(c, XM_TABLE_COLUMN_DYNAMIC_CELLS_OPTIONS_DEFAULT);
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

    private _syncColumnDefName(): void {
        if (this.columnDef) {
            this.columnDef.name = this._column.name || this._column.body.field;
        }
    }
}
