import { Component, Inject, Input, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { XmTableLoadingColumnComponent } from './xm-table-loading-column.component';
import { CdkHeaderRowDef, CdkTable } from '@angular/cdk/table';

@Component({
    selector: 'xm-table-loading',
    host: { class: 'xm-table-loading' },
    template: `
        <xm-table-loading-column [isLoading]="isLoading"
                                 #tableLoadingRow
                                 [colspan]="colspan"></xm-table-loading-column>
        <!-- TODO:WORKAROUND: MatTable throws an error when mat-header-row lazy created. -->
        <tr mat-header-row class="xm-table-loading-row" *matHeaderRowDef="[tableLoadingRow.config.name]"></tr>
    `,
    styles: [`
        /* Use global styles because mat-header-row renders in table and not in the xm-table-loading. */
        tr.xm-table-loading-row {
            min-height: min-content;
            height: inherit;
        }
    `],
    standalone: true,
    imports: [
        XmTableLoadingColumnComponent,
        MatTableModule
    ]
})
export class XmTableLoadingComponent {
    @Input() public isLoading: boolean;
    @Input() public colspan: number;

    @ViewChild(CdkHeaderRowDef, { static: true }) private readonly _headerRow: CdkHeaderRowDef;

    constructor(
        @Inject(CdkTable) private _table: CdkTable<unknown>,
    ) {
    }

    public ngAfterViewInit(): void {
        this._table.addHeaderRowDef(this._headerRow);
    }
}
