import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Defaults, takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { get } from 'lodash';
import { merge } from 'rxjs';
import { XmRequestBuilderService } from '../service/xm-request-builder-service/xm-request-builder.service';
import { XmTableSelectionService } from '../service/xm-table-selection-service/xm-table-selection.service';
import { XmTableActions, XmTableColumn, XmTableOptions, XmTablePagination } from '../xm-table.model';

export interface DynamicTableConfig extends Partial<XmTableColumn> {
    pagination: XmTablePagination;
    options: XmTableOptions;
    columns: XmTableColumn[];
    actions: XmTableActions;
}

const DEFAULT_DYNAMIC_TABLE_CONFIG: DynamicTableConfig = {
    options: {
        sortBy: null,
        sortDirection: 'asc',
        selectableRows: null,
        noRows: null,
    },
    columns: [],
    actions: null,
    pagination: { pageSizeOptions: [5, 10, 25] },
};

@Component({
    selector: 'xm-dynamic-table',
    templateUrl: './xm-dynamic-table.component.html',
    styleUrls: ['./xm-dynamic-table.component.scss'],
})
export class XmDynamicTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
    @Input() public loading: boolean;
    @Input() public dataSource: MatTableDataSource<T>;
    @Input() @Defaults(DEFAULT_DYNAMIC_TABLE_CONFIG) public config: DynamicTableConfig;

    public displayedColumns: string[];
    public selection;
    public total: number = 0;

    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) public sort: MatSort;

    constructor(private tableSelection: XmTableSelectionService<unknown>,
                private requestService: XmRequestBuilderService) {
        this.selection = this.tableSelection.selection;
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }

    public ngAfterViewInit(): void {
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(takeUntilOnDestroy(this))
            .subscribe((data: Sort | PageEvent) => {
                this.requestService.update(data);
            });
    }

    public ngOnInit(): void {
        this.total = get(this.dataSource, 'data.xTotalCount'); //????????????????????????

        this.displayedColumns = this.config.columns?.map((c) => c.data || c.field);

        if (this.config?.options?.selectableRows) {
            this.displayedColumns.unshift('select');
        }
    }
}
