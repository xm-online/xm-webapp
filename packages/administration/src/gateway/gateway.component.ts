import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { finalize } from 'rxjs/operators';

import { XmConfigService } from '../../../../src/app/shared/spec/config.service';
import { GatewayRoute } from './gateway-route.model';

import { GatewayRoutesService } from './gateway-routes.service';

@Component({
    selector: 'xm-gateway',
    templateUrl: './gateway.component.html',
    providers: [GatewayRoutesService],
})
export class JhiGatewayComponent implements OnInit {

    public loading: boolean;
    public displayedColumns: string[] = ['url', 'service', 'servers'];
    public dataSource: MatTableDataSource<GatewayRoute> = new MatTableDataSource([]);

    @ViewChild(MatPaginator, {static: true}) private paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) private sort: MatSort;

    constructor(
        private gatewayRoutesService: GatewayRoutesService,
        private service: XmConfigService,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
    ) {
    }

    public ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.refresh();
    }

    public refresh(): void {
        this.loading = true;
        this.gatewayRoutesService
            .findAll()
            .subscribe((gatewayRoutes) => this.dataSource.data = gatewayRoutes,
                (err) => console.warn(err),
                () => this.loading = false);
    }

    public tenantConfigRefresh(): void {
        this.alertService.open({
            title: 'Reload tenant configuration?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => result.value ? this.triggerUpdate()
            : console.info('Cancel'));
    }

    public tenantElasticUpdate(): void {
        this.alertService.open({
            title: 'Reload Elastic?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, reload!',
        }).subscribe((result) => result.value ? this.triggerUpdate('reindexTenantElastic')
            : console.info('Cancel'));
    }

    public toDate(date: unknown): Date | null {
        const isValidDate = (date) => date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
        if (isValidDate(date)) {
            return new Date(date as string);
        } else {
            return null;
        }
    }

    private triggerUpdate(type: 'updateTenantConfig' | 'reindexTenantElastic' = 'updateTenantConfig'): void {
        this.loading = true;
        this.service[type]().pipe(finalize(() => this.loading = false)).subscribe(
            (resp) => console.warn(resp),
            (err) => {
                console.warn(err);
                this.loading = false;
            },
            () => this.toasterService.success('global.actionPerformed'));
    }

}
