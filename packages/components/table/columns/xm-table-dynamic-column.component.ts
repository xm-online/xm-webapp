import { Component, Input } from '@angular/core';
import { XmTableColumnDynamicCellsComponent, XmTableColumnDynamicCellsOptions } from './xm-table-column-dynamic-cells.component';


@Component({
    selector: 'xm-table-dynamic-column',
    template: `
        <xm-table-column-dynamic-cells [column]="column"></xm-table-column-dynamic-cells>
    `,
    imports: [
        XmTableColumnDynamicCellsComponent,
    ],
    standalone: true,
})
/**
 * @beta
 */
export class XmTableDynamicColumnComponent {
    @Input() public column: XmTableColumnDynamicCellsOptions;
}
