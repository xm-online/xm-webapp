import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiOrderByPipe } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/auth';

import { ITEMS_PER_PAGE } from '@xm-ngx/components/pagination';
import { RoleMatrix, RoleMatrixPermission } from '../../../../src/app/shared/role/role.model';
import { RoleService } from '../../../../src/app/shared/role/role.service';
import { XM_PAGE_SIZE_OPTIONS } from '../../../../src/app/xm.constants';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface TableDisplayColumn {
    key: string,
    hidden: boolean,
}

@Component({
    selector: 'xm-roles-matrix',
    templateUrl: './roles-matrix.component.html',
    providers: [JhiOrderByPipe],
    styleUrls: ['./roles-matrix.component.scss'],
})
export class RolesMatrixComponent implements OnInit {

    @ViewChild('table', {static: false}) public table: ElementRef;

    public matrix: RoleMatrix;
    public permissions: RoleMatrixPermission[];
    public totalItems: any;
    public queryCount: any;
    public itemsPerPage: any;
    public page: any = 1;
    public previousPage: any;
    public predicate: any = 'privilegeKey';
    public reverse: boolean = true;
    public showLoader: boolean;
    public sortBy: any = {};
    public entities: string[];
    public hiddenRoles: any[] = [];
    public checkAll: boolean[] = [];
    public hasChanges: boolean;
    public permittedFilter: any[] = [
        {},
        {trans: 'permitted', value: 'allset'},
        {trans: 'notPermitted', value: 'notset'},
        {trans: 'permittedAny', value: 'anyset'},
    ];
    private permissionsSort: RoleMatrixPermission[];
    private isSort: boolean;
    public itemsPerPageOptions: number[] = XM_PAGE_SIZE_OPTIONS;
    public originalColumns: TableDisplayColumn[] = [
        {key: 'privilegeKey', hidden: false},
        {key: 'permissionDescription', hidden: false},
        {key: 'msName', hidden: false},
    ];

    public displayedColumns: string[];
    public dataSource: MatTableDataSource<RoleMatrixPermission> =
        new MatTableDataSource<RoleMatrixPermission>([]);
    @ViewChild(MatSort, {static: true}) public sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;

    constructor(
        private principal: Principal,
        private roleService: RoleService,
        private alertService: XmToasterService,
        private orderByPipe: JhiOrderByPipe,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    public ngOnInit(): void {
        this.principal.identity().then(() => {
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.load();
        });
    }

    public load(): void {
        this.showLoader = true;
        this.roleService.getMatrix().subscribe(
            (result: RoleMatrix) => {
                if (result.roles && result.roles.length && result.permissions && result.permissions.length) {
                    result.permissions.forEach((item) => {
                        item.roles = item.roles || [];
                        item.roles = result.roles.map((el) => {
                            // eslint-disable-next-line @typescript-eslint/prefer-includes
                            const value = item.roles.indexOf(el) !== -1;
                            item.data = {...item.data, [el]: {checked: value, valueOrg: value}};
                            return {value, valueOrg: value};
                        });
                    });
                    result.permissions = this.orderByPipe.transform(result.permissions, this.predicate, !this.reverse);
                }
                this.matrix = result;
                this.originalColumns = [...this.originalColumns, ...this.matrix.roles.map(r => ({key: r, hidden: false}))];
                this.dataSource.data = this.matrix.permissions;
                this.entities = this.getEntities(result.permissions);
                this.queryCount = this.totalItems = result.permissions.length;
                this.permissions = this.getItemsByPage(this.paginator.pageIndex  +1);

                this.buildColumns(this.originalColumns);
            },
            (resp) => this.onError(resp),
            () => this.showLoader = false,
        );
    }

    public getValue(p: RoleMatrixPermission): RoleMatrixPermission {
        return p;
    }

    public buildColumns(cols: TableDisplayColumn[]): void {
        this.displayedColumns = cols.filter(c => !c.hidden).map(c => c.key);
    }

    public onLoadPage(page: number): void {
        this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.permissions = this.getItemsByPage(page);
        }
    }

    public onTransition(page: number): void {
        if (this.isSort) {
            this.permissionsSort = this.orderByPipe.transform(this.permissionsSort, this.predicate, !this.reverse);
        } else {
            this.matrix.permissions = this.orderByPipe.transform(this.matrix.permissions,
                this.predicate, !this.reverse);
        }
        this.permissions = this.getItemsByPage(page);
    }

    public onChangeSort(): void {
        this.paginator.pageIndex = 0;
        if (this.sortBy.msName || this.sortBy.query || this.sortBy.permitted_filter) {
            this.isSort = true;
            this.dataSource.data = this.groupByItem(this.matrix.permissions);
        } else {
            this.isSort = false;
            this.dataSource.data = this.matrix.permissions;
        }
    }

    public onChangePerPage(): void {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    public onHideRole(role: string, indx: number): void {
        this.hiddenRoles.push({role, indx});
        this.originalColumns.map(c => {
            if (c.key === role) {
                c.hidden = true
            }
        });
        this.buildColumns(this.originalColumns);
    }

    public onViewRole(item: {role: string, indx: number | string}): void {
        this.hiddenRoles = this.hiddenRoles.filter((el) => el.indx !== item.indx);
        this.originalColumns = this.originalColumns.map(c => {
            if (c.key === item.role) {
                c.hidden = false;
            }
            return c;
        });
        this.buildColumns(this.originalColumns);
    }

    public onCheckAll(indx: number): void {
        const check = this.checkAll[indx];
        (this.isSort ? this.permissionsSort : this.matrix.permissions)
            .forEach((item) => item.roles[indx].value = check);
    }

    public onCancel(): void {
        this.matrix.permissions.forEach((item) => item.roles.forEach((el) => el.value = el.valueOrg));
        this.hasChanges = false;
    }

    public onSave(): void {
        this.showLoader = true;
        const roles = this.matrix.roles;
        const matrix: RoleMatrix = Object.assign({}, this.matrix);
        matrix.permissions = matrix.permissions.map((perm) => {
            const item = Object.assign({}, perm);
            item.roles = item.roles.reduce((result, el, pos) => {
                if (el.value) {
                    result.push(roles[pos]);
                }
                return result;
            }, []);
            return item;
        });
        this.roleService.updateMatrix(matrix).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                () => {
                    this.matrix.permissions.forEach((item) => item.roles.forEach((el) => el.valueOrg = el.value));
                    this.hasChanges = false;
                },
                (resp: Response) => {
                    this.onError(resp);
                    this.showLoader = false;
                },
                () => this.showLoader = false,
            );
    }

    public isChanged(role?: string, e?: MatCheckboxChange | MatSlideToggleChange, all?: boolean): void {
        if (!all) {
            this.matrix.permissions.filter(p => p.privilegeKey === role).forEach((p: RoleMatrixPermission) => {
                p.data = {...p.data, [role]: {checked: e.checked}}
            });
        } else {
            this.matrix.permissions.forEach((p: RoleMatrixPermission) => {
                p.data = {...p.data, [role]: {checked: e.checked}}
            });
        }
    }

    public isAllChecked(role: string): boolean {
       const totalByRole = this.matrix.permissions.length;
       const totalByRoleChecked = this.matrix.permissions
           .filter((p: RoleMatrixPermission) => p.data[role].checked).length;
       return totalByRole === totalByRoleChecked;
    }

    private getItemsByPage(page: any): RoleMatrixPermission[] {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return (this.isSort ? this.permissionsSort : this.matrix.permissions).slice(startPos, endPos);
    }

    private getEntities(list: RoleMatrixPermission[] = []): string[] {
        return list.reduce((result, item) => {
            if (!result.find((el) => el === item.msName)) {
                result.push(item.msName);
            }
            return result;
        }, ['']).sort();
    }

    private groupByItem(list: any): any {
        const sortBy = this.sortBy;
        return list.reduce((result: RoleMatrixPermission[], item: RoleMatrixPermission) => {
            const clearItemsbyRoles = item.roles.filter((x, y) => {
                if (!this.hiddenRoles.some((i) => i.indx === y)) {
                    return x;
                }
            });
            const anySet = clearItemsbyRoles.some((x) => x.value);
            const allSet = clearItemsbyRoles.every((x) => x.value);
            if (
                (sortBy.msName && item.msName !== sortBy.msName) ||
                // eslint-disable-next-line @typescript-eslint/prefer-includes
                (sortBy.query && item.privilegeKey.indexOf(sortBy.query.toUpperCase()) === -1) ||
                (sortBy.permitted_filter === 'anyset' && anySet !== true) ||
                (sortBy.permitted_filter === 'notset' && anySet !== false) ||
                (sortBy.permitted_filter === 'allset' && allSet !== true)
            ) {
                // empty block
            } else {
                result.push(item);
            }
            return result;
        }, []);
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
