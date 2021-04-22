import { Component, Input, NgModule } from '@angular/core';
import { XmTableColumnDynamicCellsModule, XmTableColumnDynamicCellsOptions } from './xm-table-column-dynamic-cells';


@Component({
    selector: 'xm-table-dynamic-column',
    template: `
        <xm-table-column-dynamic-cells [column]="column"></xm-table-column-dynamic-cells>
    `,
})
/**
 * @beta
 */
export class XmTableDynamicColumnComponent {
    @Input() public column: XmTableColumnDynamicCellsOptions;
}

@NgModule({
    imports: [
        XmTableColumnDynamicCellsModule,
    ],
    exports: [XmTableDynamicColumnComponent],
    declarations: [XmTableDynamicColumnComponent],
})
export class XmTableDynamicColumnModule {
}
