import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
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
        <tr mat-header-row class="xm-table-loading-row" *matHeaderRowDef="[tableLoadingRow.config.name]"></tr>
    `,
    styles: [`
        /* Use global styles when mat-header-row renders in table and not in the xm-table-loading. */
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
export class XmTableLoadingComponent implements AfterViewInit {
    @Input() public isLoading: boolean;
    @Input() public colspan: number;

    @ViewChild(CdkHeaderRowDef, { static: true }) private readonly _headerRow: CdkHeaderRowDef;

    constructor(
        @Inject(CdkTable) private table: CdkTable<unknown>,
    ) {
    }

    public ngAfterViewInit(): void {
        this.table.addHeaderRowDef(this._headerRow);
    }
}
