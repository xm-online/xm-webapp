import { DataSource } from '@angular/cdk/table';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Defaults } from '@xm-ngx/shared/operators';
import { map, Observable, of } from 'rxjs';
import { DEFAULT_XM_TABLE_CONFIG, XmTableConfig } from './interfaces/xm-table.model';
import { XmTableDataLoaderService } from '@xm-ngx/components/table/table/data/xm-table-data-loader.service';
import { XmRequestBuilderService } from '@xm-ngx/components/table/table/requests/xm-request-builder.service';

@Component({
    selector: 'xm-table',
    templateUrl: './xm-table.component.html',
    styleUrls: ['./xm-table.component.scss'],
})
export class XmTableComponent implements OnInit {
    @Input() @Defaults(DEFAULT_XM_TABLE_CONFIG) public config: XmTableConfig;

    public dataSource$: Observable<DataSource<unknown>>;
    public loading$: Observable<boolean> = of(false);

    constructor(private dataService: XmTableDataLoaderService<unknown>,
                private requestService: XmRequestBuilderService) {
    }

    public ngOnInit(): void {
        this.initialRequestParams();
        this.dataSource$ = this.dataService.getData(this.config.dataSource).pipe(
            map((data: unknown[] & {xTotalCount?: number}) => new MatTableDataSource(data)),
        );
        this.loading$ = this.dataService.loading$();
    }

    private initialRequestParams(): void {
        this.requestService.update({
            active: this.config.options?.sortBy,
            direction: this.config.options?.sortDirection,
            pageIndex: 0,
            pageSize: this.config.pagination?.pageSizeOptions[0],
        });
    }
}
