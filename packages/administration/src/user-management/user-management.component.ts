import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { XmToasterService } from '@xm-ngx/toaster';

import { JhiParseLinks } from 'ng-jhipster';
import { merge, Observable, Subscription } from 'rxjs';
import { finalize, map, startWith, switchMap } from 'rxjs/operators';
import { Client, RoleService, User, UserLogin, UserLoginService, UserService } from '../../../../src/app/shared';

import { XM_EVENT_LIST } from '../../../../src/app/xm.constants';
import { BaseAdminListComponent } from '../admin.service';
import { UserLoginMgmtDialogComponent } from './user-login-management-dialog.component';
import { UserMgmtDeleteDialogComponent } from './user-management-delete-dialog.component';
import { UserMgmtDialogComponent } from './user-management-dialog/user-management-dialog.component';

@Component({
    selector: 'xm-user-mgmt',
    templateUrl: './user-management.component.html',
})
export class UserMgmtComponent extends BaseAdminListComponent implements OnDestroy {

    public eventModify: string = XM_EVENT_LIST.XM_USER_LIST_MODIFICATION;
    public eventSubscriber: Subscription;
    public basePredicate: string = 'id';
    public login: string;
    public authorities: any[];
    public currentSearch: string;
    public onlineUsers: number = 0;

    public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
    @ViewChild(MatSort, { static: true }) public matSort: MatSort;
    @ViewChild(MatPaginator, { static: true }) public paginator: MatPaginator;

    public displayedColumns: string[] = [
        'id',
        'logins',
        '2FA',
        'langKey',
        'roleKey',
        'createdDate',
        'lastModifiedBy',
        'lastModifiedDate',
        'actions',
    ];

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected toasterService: XmToasterService,
        protected alertService: XmAlertService,
        protected eventManager: XmEventManager,
        protected parseLinks: JhiParseLinks,
        protected router: Router,
        private modalService: MatDialog,
        private userLoginService: UserLoginService,
        private userService: UserService,
        private roleService: RoleService,
    ) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.currentSearch = activatedRoute.snapshot.params.search || activatedRoute.snapshot.queryParams.userRole || '';
        this.login = activatedRoute.snapshot.queryParams.userLogin || '';
    }

    public registerChangeInList(): void {
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

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
        this.eventManager.destroy(this.eventSubscriber);
    }

    public ngAfterViewInit(): void {
        this.registerChangeInList();
        this.roleService.getRoles()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((roles) => this.authorities = roles.map((role) => role.roleKey).sort());
        this.userService.getOnlineUsers()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((result) => this.onlineUsers = result.body);

        this.matSort.sortChange.pipe(takeUntilOnDestroy(this)).subscribe(() => this.paginator.pageIndex = 0);
        merge(this.matSort.sortChange, this.paginator.page).pipe(
            startWith({}),
            switchMap(() => {
                this.pagination.pageIndex = this.paginator.pageIndex;
                this.pagination.pageSize = this.paginator.pageSize;
                this.pagination.sortOrder = this.matSort.direction;
                this.pagination.sortBy = this.matSort.active;
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

    public getRegistrationEmail(user: User): string {
        if (!user || !user.logins) {
            return '';
        }

        for (const entry of user.logins) {
            if (entry.typeKey === 'LOGIN.EMAIL') {
                return entry.login;
            }
        }

        console.info('Key LOGIN.EMAIL not found %o', user.logins);
        return '';
    }

    public enable2FA(user: User): void {
        this.alertService.open({
            title: 'Enable 2FA?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, Enable',
        }).subscribe((result) => result.value ?
            this.userService.enable2FA(user.userKey, this.getRegistrationEmail(user))
                .subscribe(
                    () => {
                        user.tfaEnabled = true;
                        this.toasterService.success('userManagement.twoFAEnabled');
                    },
                    (error) => this.toasterService.error(error)) :
            console.info('Cancel'));
    }

    public disable2FA(user: User): void {
        this.alertService.open({
            title: 'Disable 2FA?',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, Disable',
        }).subscribe((result) => result.value ?
            this.userService.disable2FA(user.userKey)
                .subscribe(() => {
                        user.tfaEnabled = false;
                        this.toasterService.success('userManagement.twoFADisabled');
                    },
                    (error) => this.toasterService.error(error)) :
            console.info('Cancel'));
    }

    public loadUsers(): Observable<User[]> {
        return this.userService.query({
            page: this.pagination.pageIndex,
            size: this.pagination.pageSize,
            sort: [`${this.matSort.active},${this.matSort.direction}`],
            roleKey: this.currentSearch,
        }).pipe(
            map(res => this.onSuccess(res.body, res.headers)),
            finalize(() => this.showLoader = false),
        );
    }

    public loadFilteredUsers(): Observable<User[]> {
        return this.userService.loginContains({
            page: this.pagination.pageIndex,
            size: this.pagination.pageSize,
            sort: [`${this.matSort.active},${this.matSort.direction}`],
            roleKey: this.currentSearch,
            login: this.login,
        })
            .pipe(
                map(res => this.onSuccess(res.body, res.headers)),
                finalize(() => this.showLoader = false),
            );
    }

    public getLogin(login: UserLogin): string {
        return this.userLoginService.getLogin(login);
    }

    public applySearchByRole(roleKey: string): void {
        this.login = null;
        this.pagination.pageIndex = 0;
        this.currentSearch = roleKey;
        this.loadAll()
            .pipe(
                takeUntilOnDestroy(this),
                finalize(() => this.showLoader = false),
            )
            .subscribe((list: Array<User>) => {
                this.dataSource = new MatTableDataSource(list);
            });
    }

    public searchByLogin(): void | null {
        this.matSort.active = this.basePredicate;
        this.pagination.pageIndex = 0;
        this.currentSearch = null;
        this.loadAll()
            .pipe(takeUntilOnDestroy(this))
            .subscribe((list: Array<User>) => {
                this.dataSource = new MatTableDataSource(list);
            });
    }

    public onAdd(): void {
        this.modalService.open(UserMgmtDialogComponent, { width: '500px' });
    }

    public onEdit(user: User): void {
        const modalRef = this.modalService.open(UserMgmtDialogComponent, { width: '500px' });
        modalRef.componentInstance.selectedUser = user;
    }

    public onLoginEdit(user: User): void {
        const modalRef = this.modalService.open(UserLoginMgmtDialogComponent, { width: '500px' });
        modalRef.componentInstance.user = user;
    }

    public onDelete(user: User): void {
        const modalRef = this.modalService.open(UserMgmtDeleteDialogComponent, { width: '500px' });
        modalRef.componentInstance.user = user;
    }

    public loadAll(): Observable<User[]> {
        this.updateRoute();
        this.showLoader = true;
        if (this.login && this.login.trim()) {
            return this.loadFilteredUsers();
        } else {
            return this.loadUsers();
        }
    }

    protected updateRoute(): void {
        this.router.navigate(this.options.navigateUrl, {
            queryParams: {
                pageSize: this.pagination.pageSize,
                pageIndex: this.pagination.pageIndex,
                sortBy: this.pagination.sortBy,
                sortOrder: this.pagination.sortOrder,
                userLogin: this.login,
                userRole: this.currentSearch,
            },
        });
    }

}
