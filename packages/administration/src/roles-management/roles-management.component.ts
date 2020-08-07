import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiOrderByPipe } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { Principal } from '@xm-ngx/core/auth';
import { ITEMS_PER_PAGE } from '@xm-ngx/components/pagination';
import { Role } from '../../../../src/app/shared/role/role.model';
import { RoleService } from '../../../../src/app/shared/role/role.service';
import { RoleMgmtDeleteDialogComponent } from './roles-management-delete-dialog.component';
import { RoleMgmtDialogComponent } from './roles-management-dialog.component';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: 'xm-roles-mgmt',
    templateUrl: './roles-management.component.html',
    providers: [JhiOrderByPipe],
    styles: [`
        :host .role-description {
            max-width: 300px;
            min-width: 300px;
        }
    `]
})
export class RolesMgmtComponent implements OnInit, OnDestroy {

    public itemsPerPage: 10 | 20 | 50;
    public predicate: string = 'roleKey';
    public reverse: boolean = true;
    public showLoader: boolean;
    private eventSubscriber: Subscription;
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
    @ViewChild(MatSort, {static: true}) public sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;

    constructor(
        private roleService: RoleService,
        private alertService: XmToasterService,
        private principal: Principal,
        private eventManager: XmEventManager,
        private modalService: MatDialog,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.registerChangeInRoles();
    }

    public ngOnInit(): void {
        this.principal.identity().then(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.loadAll();
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    public loadAll(): void {
        this.showLoader = true;
        this.roleService.getRoles()
            .subscribe(
                (result) => {
                    this.dataSource.data = result;
                },
                (res: Response) => this.onError(res),
                () => this.showLoader = false,
            );
    }

    public onAdd(): void {
        this.modalService.open(RoleMgmtDialogComponent, {width: '500px'});
    }

    public onEdit(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedRole = role;
    }

    public onDelete(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDeleteDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedRole = role;
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
