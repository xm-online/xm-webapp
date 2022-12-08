import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatorParamsService } from '@xm-ngx/components/table/xm-table/service/paginator-params-service';
import { TableSelectionService } from '@xm-ngx/components/table/xm-table/service/xm-table-selection-service/table-selection.service';
import { EmptyTableConfig, TableActions } from '@xm-ngx/components/table/xm-table/xm-table.model';


@Component({
    selector: 'xm-dynamic-table',
    templateUrl: './xm-dynamic-table.component.html',
    styleUrls: ['./xm-dynamic-table.component.scss'],
})
export class XmDynamicTableComponent implements OnInit, AfterViewInit {
    @Input() public loading: boolean;
    @Input() public dataSource: MatTableDataSource<unknown>;
    @Input() public config: {
        pagination?: {pageSizeOptions: number[]};
        options?: any;
        columns?: any;
        actions?: TableActions
        selectableRows?: boolean;
        sortDirection?: 'asc' | 'desc' | undefined;
        sortBy?: string;
        noRows?: {
            initial: EmptyTableConfig,
            filter: EmptyTableConfig,
        }
    } = {};

    public displayedColumns: any;
    public selection;

    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) public sort: MatSort;

    constructor(private tableSelection: TableSelectionService<unknown>,
                private paginatorService: PaginatorParamsService) {
        this.selection = this.tableSelection.selection;
    }

    public ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    public ngOnInit(): void {

        this.displayedColumns = this.config.columns?.map((c) => c.key || c.name || c.field);

        if (this.config?.options?.selectable) {
            this.displayedColumns.unshift('select');
        }
    }


    public pageChange(event: PageEvent): void {
        this.paginatorService.setPage(event);
    }
}
