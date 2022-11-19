import {CDK_TABLE} from '@angular/cdk/table';
import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatColumnDef, MatTableDataSource} from '@angular/material/table';
import {TableColumnsManager} from '@xm-ngx/components/table/column/table-columns-manager';
import {TableSelectionService} from '@xm-ngx/components/table/xm-table/selection-column/table-selection.service';

@Component({
    selector: 'xm-selection-column',
    templateUrl: './selection-column.component.html',
    styleUrls: ['./selection-column.component.scss'],
})
export class SelectionColumnComponent implements OnInit {
    // TODO change interface
    @Input() public dataSource: MatTableDataSource<unknown>;

    public selection;
    public disabled: boolean;

    constructor(@Inject(CDK_TABLE) protected columnsManager: TableColumnsManager,
                @Inject(TableSelectionService) private _selection: TableSelectionService<unknown>) {
        this.selection = this._selection.selection;
    }

    @ViewChild(MatColumnDef, {static: true}) public columnDef: MatColumnDef;

    public ngOnInit(): void {
        this.columnsManager.addColumnDef(this.columnDef);
        this.dataSource.connect().subscribe(data => {
            this.disabled = data.length === 0;
        });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected == numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public toggleAllRows(): void {

        // this._selection.toggleAll(this.isAllSelected());
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
        console.log(this.selection, this.dataSource);
    }

}
