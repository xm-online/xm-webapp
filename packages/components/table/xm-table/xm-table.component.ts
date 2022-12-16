import { DataSource } from '@angular/cdk/table';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Translate } from '@xm-ngx/translation';
import { defaultsDeep } from 'lodash';
import { map, Observable, of } from 'rxjs';
import { DataService } from './service/data-service/data.service';
import { RequestBuilderService } from './service/request-builder-service/request-builder.service';
import { TableActions, TableColumn, TableDatasource, TableOptions, TablePagination } from './xm-table.model';

export interface CurrentConfig {
    pagination: {pageSizeOptions: number[]};

}

export type ConfigForTable = {
    title?: Translate;
    dataSource: TableDatasource;
    columns?: TableColumn[];
    filters?: any;
    options?: TableOptions;
    actions?: TableActions;
    pagination?: TablePagination;
}

@Component({
    selector: 'xm-table',
    templateUrl: './xm-table.component.html',
    styleUrls: ['./xm-table.component.scss'],
})
export class XmTableComponent<T> implements OnInit {
    private _config: ConfigForTable | any;
    get config(): ConfigForTable {
        return this._config;
    }

    @Input() set config(value: ConfigForTable) {
        this._config = defaultsDeep({}, value);
    }

    public dataSource$: Observable<DataSource<T>>;
    public loading$: Observable<boolean> = of(false);

    constructor(private dataService: DataService<T>,
                private requestService: RequestBuilderService) {
    }

    public ngOnInit(): void {
        this.initialRequestParams();
        this.dataSource$ = this.dataService.getData(this.config.dataSource).pipe(
            map((data: T[] & {xTotalCount?: number}) => new MatTableDataSource(data)),
        );
        this.loading$ = this.dataService.loading$();
    }

    private initialRequestParams(): void {
        this.requestService.update({
            active: this.config.options.sortBy,
            direction: this.config.options.sortDirection,
            pageIndex: 0,
            pageSize: this.config.pagination.pageSizeOptions[0],
        });
    }

}
