import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Translate} from '@xm-ngx/translation';
import {defaultsDeep} from 'lodash';
import {Observable, of} from 'rxjs';
import {TableColumn, TableDatasource} from '@xm-ngx/components/table/xm-table/xm-table.model';
import {DataService} from '@xm-ngx/components/table/xm-table/service/data-service/data.service';

export interface CurrentConfig {
    pagination: { pageSizeOptions: number[] };

}

export type ConfigForTable = {
    dataSource: TableDatasource;
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

    constructor(private dataService: DataService) {
    }

    public ngOnInit(): void {
        this.dataService.getData(this.config.dataSource).subscribe(data => {
            this.dataSource = new MatTableDataSource(data);
        });
    }
}
