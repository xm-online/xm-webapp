import { DataSource } from '@angular/cdk/table';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Defaults } from '@xm-ngx/shared/operators';
import { map, Observable, of } from 'rxjs';
import { XmRequestBuilderService } from './service/xm-request-builder-service/xm-request-builder.service';
import { XmTableDataLoaderService } from './service/xm-table-data-service/xm-table-data-loader.service';
import { DEFAULT_XM_TABLE_CONFIG, XmTableConfig } from './xm-table.model';

@Component({
    selector: 'xm-table',
    templateUrl: './xm-table.component.html',
    styleUrls: ['./xm-table.component.scss'],
})
export class XmTableComponent<T> implements OnInit {
    @Input() @Defaults(DEFAULT_XM_TABLE_CONFIG) public config: XmTableConfig;

    public dataSource$: Observable<DataSource<T>>;
    public loading$: Observable<boolean> = of(false);

    constructor(private dataService: XmTableDataLoaderService<T>,
                private requestService: XmRequestBuilderService) {
    }

    public ngOnInit(): void {
        this.initialRequestParams();
        this.dataSource$ = this.dataService.getData(this.config?.dataSource).pipe(
            map((data: T[] & {xTotalCount?: number}) => new MatTableDataSource(data)),
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
