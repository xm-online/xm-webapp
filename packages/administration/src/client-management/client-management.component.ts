import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { TableColumn } from '@xm-ngx/components/table/column/table-column-dynamic-cell';
import { XmEventManager } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiParseLinks } from 'ng-jhipster';
import { merge, Observable, Subscription } from 'rxjs';
import { finalize, map, startWith, switchMap } from 'rxjs/operators';

import { Client, ClientService } from '../../../../src/app/shared';
import { BaseAdminListComponent } from '../admin.service';
import { ClientMgmtDeleteDialogComponent } from './client-management-delete-dialog.component';
import { ClientMgmtDialogComponent } from './client-management-dialog.component';


@Component({
    selector: 'xm-client-mgmt',
    templateUrl: './client-management.component.html',
})
export class ClientMgmtComponent extends BaseAdminListComponent implements OnInit, OnDestroy {

    public list: Client[];
    public eventModify: string = 'clientListModification';
    public basePredicate: string = 'lastModifiedDate';
    public clientId: string;
    public dataSource: MatTableDataSource<Client> = new MatTableDataSource<Client>([]);
    @ViewChild(MatSort, { static: true }) public matSort: MatSort;
    @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
    public displayedColumns: string[] = [
        'id',
        'clientId',
        'roleKey',
        'description',
        'createdBy',
        'createdDate',
        'lastModifiedBy',
        'lastModifiedDate',
        'actions',
    ];
    private eventSubscriber: Subscription;
    @Input() public config: { columns: TableColumn[] };

    constructor(
        protected clientService: ClientService,
        protected activatedRoute: ActivatedRoute,
        protected toasterService: XmToasterService,
        protected alertService: XmAlertService,
        protected eventManager: XmEventManager,
        protected parseLinks: JhiParseLinks,
        private modalService: MatDialog,
        protected router: Router,
    ) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.showLoader = true;
        this.registerChangeInClients();
        this.clientId = activatedRoute.snapshot.queryParams.clientId || '';
    }

    public ngOnInit(): void {
        const extraColumns = this.config.columns?.map((c) => c.name || c.field) || [];
        this.displayedColumns.push(...extraColumns);

        this.dataSource.sort = this.matSort;
        this.dataSource.paginator = this.paginator;
    }

    public ngAfterViewInit(): void {
        this.matSort.sortChange.pipe(takeUntilOnDestroy(this)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page).pipe(
            startWith({}),
            switchMap(() => {
                this.showLoader = true;
                return this.loadAll();
            }),
            takeUntilOnDestroy(this),
        ).subscribe((list: Array<Client>) => {
            this.dataSource = new MatTableDataSource(list);
        },
        (err) => {
            this.onError(err);
            this.showLoader = false;
        });

    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        this.eventManager.destroy(this.eventSubscriber);
    }

    public loadAll(): Observable<Client[]> {
        this.updateRoute();
        if (this.clientId) {
            return this.loadClientsById(this.clientId);
        }
        return this.loadClients();

    }

    public trackIdentity(_index: number | string, item: Client): number {
        return item.id;
    }


    public filterByClientId(): void {
        this.showLoader = true;
        this.paginator.pageIndex = 0;
        this.loadAll()
            .pipe(
                takeUntilOnDestroy(this),
            ).subscribe((list: Array<Client>) => {
                this.dataSource = new MatTableDataSource(list);
            });
    }

    public onDelete(client: Client): void {
        const modalRef = this.modalService.open(ClientMgmtDeleteDialogComponent, { width: '500px' });
        modalRef.componentInstance.selectedClient = client;
    }

    public onEdit(client: Client): void {
        const modalRef = this.modalService.open(ClientMgmtDialogComponent, { width: '500px' });
        modalRef.componentInstance.selectedClient = client;
    }

    public onAdd(): void {
        this.modalService.open(ClientMgmtDialogComponent, { width: '500px' });
    }

    private loadClients(): Observable<Client[]> {
        return this.clientService.query({
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            sort: [`${this.matSort.active},${this.matSort.direction}`],
        })
            .pipe(
                map(res => this.onSuccess(res.body, res.headers)),
                finalize(() => this.showLoader = false),
            );
    }

    private loadClientsById(clientId: string): Observable<Client[]> {
        this.showLoader = true;
        const CLIENT_ID = clientId.trim();
        return this.clientService.filterByClientId({
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            sort: [`${this.matSort.active},${this.matSort.direction}`],
            clientId: CLIENT_ID,
        })
            .pipe(
                map(res => this.onSuccess(res.body, res.headers)),
                finalize(() => this.showLoader = false),
            );
    }

    private registerChangeInClients(): void {
        this.eventSubscriber = this.eventManager.listenTo(this.eventModify)
            .pipe(
                takeUntilOnDestroy(this),
            ).subscribe(() => {
                this.showLoader = true;
                this.loadAll()
                    .pipe(
                        takeUntilOnDestroy(this),
                    ).subscribe((list: Array<Client>) => {
                        this.dataSource = new MatTableDataSource(list);
                    });
            });
    }

    protected updateRoute(): void {
        this.router.navigate(this.options.navigateUrl, {
            queryParams: {
                pageSize: this.pagination.pageSize,
                pageIndex: this.pagination.pageIndex,
                sortBy: this.pagination.sortBy,
                sortOrder: this.pagination.sortOrder,
                clientId: this.clientId,
            },
        });
    }
}
