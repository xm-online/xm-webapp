import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {DataSourceAdapter} from '@xm-ngx/components/table/xm-table/service/data-source-adapter';
import {XmTableDataSourceFactoryService} from '@xm-ngx/components/table/xm-table/service/xm-table-data-source-factory.service';
import {Translate} from '@xm-ngx/translation';
import {defaultsDeep} from 'lodash';
import {Observable, of} from 'rxjs';
import {TableColumn} from '@xm-ngx/components/table/xm-table/xm-table.model';

export interface CurrentConfig {
    pagination: { pageSizeOptions: number[] };

}

export type ConfigForTable = {
    pagination?: any;
    actions?: {
        forAll?: any;
    };
    filters?: any;
    title?: Translate;
    columns?: TableColumn[];

}

@Component({
    selector: 'xm-table',
    templateUrl: './xm-table.component.html',
    styleUrls: ['./xm-table.component.scss'],
})
export class XmTableComponent implements OnInit {
    get config(): ConfigForTable {
        return this._config;
    }

    @Input() set config(value: ConfigForTable) {
        this._config = defaultsDeep({}, value);
    }

    private _config: ConfigForTable | any;
    public dataSource;
    public loading$: Observable<boolean> = of(false);
    public selected: number;

    constructor(private dataSourceFactory: XmTableDataSourceFactoryService<unknown>) {
    }

    public ngOnInit(): void {
        try {
            this.dataSource = this.dataSourceFactory.getDataSource(this._config.dataSource);
        } catch {
            this.dataSource = new DataSourceAdapter(new MatTableDataSource([]));
        }

    }

}
