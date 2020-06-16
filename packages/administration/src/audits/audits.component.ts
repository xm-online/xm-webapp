import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Link } from '@xm-ngx/entity';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';

import * as moment from 'moment';
import { JhiOrderByPipe, JhiParseLinks } from 'ng-jhipster';
import { merge } from 'rxjs';
import { Audit } from './audit.model';
import { AuditsService } from './audits.service';

@Component({
    selector: 'xm-audits',
    templateUrl: './audits.component.html',
    providers: [JhiOrderByPipe],
})
export class AuditsComponent implements OnInit, OnDestroy {
    public fromDate: string;
    public toDate: string;
    public links: Link[];
    public totalItems: number;
    public loading: boolean;

    public dataSource: MatTableDataSource<Audit> = new MatTableDataSource([]);
    public displayedColumns: string[] = ['timestamp', 'principal', 'type', 'data.remoteAddress'];
    @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) private sort: MatSort;

    constructor(
        private auditsService: AuditsService,
        private parseLinks: JhiParseLinks,
        private datePipe: DatePipe,
    ) {
    }

    public ngOnInit(): void {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                takeUntilOnDestroy(this),
            ).subscribe(() => this.onChangeDate());

        this.today();
        this.previousMonth();
        this.onChangeDate();
    }

    public onChangeDate(): void {
        this.loading = true;
        this.auditsService.query({
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            fromDate: moment(this.fromDate).format('YYYY-MM-DD'),
            toDate: moment(this.toDate).format('YYYY-MM-DD'),
        }).subscribe(
            (res) => {
                this.links = this.parseLinks.parse(res.headers.get('link'));
                this.totalItems = +res.headers.get('X-Total-Count');
                this.dataSource.data = res.body;
            },
            (err) => console.info(err),
            () => this.loading = false);
    }

    public previousMonth(): void {
        const dateFormat = 'yyyy-MM-dd';
        let fromDate: Date = new Date();

        if (fromDate.getMonth() === 0) {
            fromDate = new Date(fromDate.getFullYear() - 1, 11, fromDate.getDate());
        } else {
            fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
        }

        this.fromDate = this.datePipe.transform(fromDate, dateFormat);
    }

    public today(): void {
        const dateFormat = 'yyyy-MM-dd';
        // Today + 1 day - needed if the current day must be included
        const today: Date = new Date();
        today.setDate(today.getDate() + 1);
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.toDate = this.datePipe.transform(date, dateFormat);
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
