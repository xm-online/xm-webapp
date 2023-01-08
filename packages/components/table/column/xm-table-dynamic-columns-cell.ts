import { CDK_TABLE } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { XmDynamicCellModule } from '@xm-ngx/dynamic';
import { XmTranslationModule } from '@xm-ngx/translation';
import { TableColumnDynamicCell } from './table-column-dynamic-cell';
import { TableColumnsManager } from './table-columns-manager';

@Component({
    selector: 'xm-table-dynamic-columns-cell',
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

export class XmTableDynamicColumnsCell extends TableColumnDynamicCell implements OnDestroy, OnInit {

    constructor(@Inject(CDK_TABLE) protected columnsManager: TableColumnsManager) {
        super(columnsManager);
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
    exports: [XmTableDynamicColumnsCell],
    declarations: [XmTableDynamicColumnsCell],
})
export class XmTableDynamicColumnsCellModule {
}
