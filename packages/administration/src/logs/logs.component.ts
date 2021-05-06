import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, map, share } from 'rxjs/operators';

import { JhiHealthService } from '../health/health.service';
import { Log } from './log.model';
import { LogsService } from './logs.service';

@Component({
    selector: 'xm-logs',
    templateUrl: './logs.component.html',
})
export class LogsComponent implements OnInit {

    public loading: boolean = true;
    public displayedColumns: string[] = ['name', 'actions'];
    public selectedService: string = '';
    public services: { name: string }[];
    public dataSource: MatTableDataSource<Log> = new MatTableDataSource([]);

    @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) private sort: MatSort;

    constructor(
        private logsService: LogsService,
        private healthService: JhiHealthService,
    ) {
    }

    public ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.healthService
            .getMonitoringServicesCollection()
            .subscribe((result) => {
                this.services = result || [];
                if (this.services.length > 0) {
                    this.selectedService = this.services[1].name;
                    this.getLoggers();
                }
            }, (error) => console.info(error));
    }

    public getLoggers(): void {
        this.loading = true;
        this.logsService
            .findByService(this.selectedService)
            .pipe(
                share(),
                map((resp) => resp.body),
                finalize(() => this.loading = false),
                share(),
            ).subscribe((data) => this.dataSource.data = data);
    }

    public changeLevel(name: string, level: string): void {
        this.loading = true;
        const log = {name, level};
        this.logsService
            .changeLevel(log, this.selectedService)
            .subscribe(() => this.getLoggers());
    }

    public applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}
