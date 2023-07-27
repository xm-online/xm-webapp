import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoadingBarModule } from '@xm-ngx/components/loading-bar';
import { MatTableModule } from '@angular/material/table';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef, CdkTable } from '@angular/cdk/table';

@Component({
    selector: 'xm-table-loading-column',
    template: `
        <ng-container [matColumnDef]="config.name">
            <th mat-header-cell
                *matHeaderCellDef
                class="xm-table-loading-column-cell"
                [attr.colspan]="colspan">
                <xm-loading-bar [visible]="isLoading"></xm-loading-bar>
            </th>
            <td mat-cell *matCellDef [attr.colspan]="colspan"></td>
        </ng-container>
    `,
    styles: [`
        th.xm-table-loading-column-cell {
            padding: 0;
            border: none;
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        LoadingBarModule,
        MatTableModule,
    ],
})
export class XmTableLoadingColumnComponent<T> implements OnInit, OnDestroy {
    @Input() public isLoading: boolean;
    @Input() public colspan: number;
    public config: { name: string } = { name: 'loading' };

    @ViewChild(CdkColumnDef, { static: true }) private readonly _columnDef: CdkColumnDef;
    @ViewChild(CdkCellDef, { static: true }) private readonly _cell: CdkCellDef;
    @ViewChild(CdkHeaderCellDef, { static: true }) private readonly _headerCell: CdkHeaderCellDef;

    constructor(
        @Inject(CdkTable) private _table: CdkTable<T>,
    ) {
    }

    public ngOnInit(): void {
        this._columnDef.name = this.config.name;
        this._columnDef.cell = this._cell;
        this._columnDef.headerCell = this._headerCell;
        this._table.addColumnDef(this._columnDef);
    }

    public ngOnDestroy(): void {
        this._table.removeColumnDef(this._columnDef);
    }
}

