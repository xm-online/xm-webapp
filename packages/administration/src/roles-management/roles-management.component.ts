import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsPageable } from '@xm-ngx/components/entity-collection';
import { TABLE_CONFIG_DEFAULT } from '@xm-ngx/components/table';
import { XmEventManager } from '@xm-ngx/core';
import { takeUntilOnDestroy } from '@xm-ngx/shared/operators';
import { XmToasterService } from '@xm-ngx/toaster';
import { merge, Subscription } from 'rxjs';
import { startWith, take } from 'rxjs/operators';
import { XmConfigService } from '../../../../src/app/shared';
import { Role } from '../../../../src/app/shared/role/role.model';
import { RoleService } from '../../../../src/app/shared/role/role.service';

import { RoleMgmtDeleteDialogComponent } from './roles-management-delete-dialog.component';
import { RoleMgmtDialogComponent } from './roles-management-dialog.component';

@Component({
    selector: 'xm-roles-mgmt',
    templateUrl: './roles-management.component.html',
    styles: [`
        :host .role-description {
            max-width: 300px;
            min-width: 300px;
        }
    `],
})
export class RolesMgmtComponent implements OnInit, OnDestroy {

    public options: {
        pageSizeOptions: number[],
        pageSize: number,
        sortDirection: 'asc' | 'desc',
        sortBy: string
    } = {
        pageSizeOptions: TABLE_CONFIG_DEFAULT.pageSizeOptions,
        pageSize: TABLE_CONFIG_DEFAULT.pageSize,
        sortDirection: 'desc',
        sortBy: 'roleKey',
    };

    public pagination: QueryParamsPageable = {
        total: 0,
        pageIndex: 0,
        pageSize: this.options.pageSize,
        sortBy: this.options.sortBy,
        sortDirection: this.options.sortDirection,
    };

    public showLoader: boolean;
    public displayedColumns: string[] = [
        'roleKey',
        'description',
        'createdBy',
        'createdDate',
        'updatedBy',
        'updatedDate',
        'actions',
    ];
    public dataSource: MatTableDataSource<Role> = new MatTableDataSource<Role>([]);
    public readOnlyMode: boolean;
    @ViewChild(MatSort, { static: true }) public sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;
    private eventSubscriber: Subscription;

    constructor(
        private roleService: RoleService,
        private alertService: XmToasterService,
        private router: Router,
        private eventManager: XmEventManager,
        private activatedRoute: ActivatedRoute,
        private modalService: MatDialog,
        private configService: XmConfigService,
    ) {
        this.registerChangeInRoles();
        const data: QueryParamsPageable = this.activatedRoute.snapshot.queryParams;
        this.pagination.pageSize = data.pageSize || this.options.pageSize;
        this.pagination.pageIndex = data.pageIndex || 0;
        this.pagination.sortOrder = data.sortOrder || this.options.sortDirection;
        this.pagination.sortBy = data.sortBy || this.options.sortBy;
    }

    public ngOnInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.loadAll();

        this.configService.getUiConfig()
            .pipe(take(1))
            .subscribe(result => {
                this.readOnlyMode = result.readOnlyConfig;
            });
    }

    public ngAfterViewInit(): void {
        this.sort.sortChange.pipe(takeUntilOnDestroy(this)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.sort.sortChange, this.paginator.page).pipe(
            startWith({}),
            takeUntilOnDestroy(this),
        ).subscribe(() => {
            this.pagination.pageIndex = this.paginator.pageIndex;
            this.pagination.pageSize = this.paginator.pageSize;
            this.pagination.sortOrder = this.sort.direction;
            this.pagination.sortBy = this.sort.active;
            this.updateRoute();
        },
        (err) => {
            this.onError(err);
            this.showLoader = false;
        });

    }

    public ngOnDestroy(): void {
        this.eventSubscriber.unsubscribe();
    }

    public loadAll(): void {
        this.showLoader = true;
        this.roleService.getRoles()
            .subscribe(
                (result) => {
                    this.dataSource.data = result;
                    this.pagination.total = result.length;
                },
                (res: Response) => this.onError(res),
                () => this.showLoader = false,
            );
    }

    public onAdd(): void {
        this.modalService.open(RoleMgmtDialogComponent, { width: '500px' });
    }

    public onEdit(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDialogComponent, { width: '500px' });
        modalRef.componentInstance.selectedRole = role;
    }

    public onDelete(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDeleteDialogComponent, { width: '500px' });
        modalRef.componentInstance.selectedRole = role;
    }

    protected updateRoute(): void {
        this.router.navigate([], {
            queryParams: {
                pageSize: this.pagination.pageSize,
                pageIndex: this.pagination.pageIndex,
                sortBy: this.pagination.sortBy,
                sortOrder: this.pagination.sortOrder,
            },
        });
    }

    private registerChangeInRoles(): void {
        this.eventSubscriber = this.eventManager.subscribe('roleListModification', () => this.loadAll());
    }

    private onError(resp: any): void {
        try {
            const res = resp.body || {};
            this.alertService.error(res.error_description, res.params);
        } catch (e) {
            // empty block
        }
    }
}
