import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiAlertService, JhiEventManager, JhiOrderByPipe } from 'ng-jhipster';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Principal } from '../../shared/auth/principal.service';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { Role, RoleOptions } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { RoleMgmtDialogComponent} from './roles-management-dialog.component';
import { RoleMgmtDeleteDialogComponent} from './roles-management-delete-dialog.component';
import { Store } from '@ngxs/store';
import { GetRolesByPage, PopulateRoles } from './role.actions';

@Component({
    selector: 'xm-roles-mgmt',
    templateUrl: './roles-management.component.html',
    providers: [JhiOrderByPipe]
})
export class RolesMgmtComponent implements OnInit, OnDestroy {

    roles$: Observable<Role>;
    roleOptions: RoleOptions = new RoleOptions(false, false, 1, 'roleKey');

    private eventSubscriber: Subscription;

    constructor(
        private store: Store,
        private roleService: RoleService,
        private alertService: JhiAlertService,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private orderByPipe: JhiOrderByPipe,
        private modalService: NgbModal,
    ) {
        this.roleOptions.itemsPerPage = ITEMS_PER_PAGE;
        this.registerChangeInRoles();
        this.roles$ = this.store.select((state) => state.roles.roles);
    }


    ngOnInit() {
        this.principal.identity().then(() => {
            this.loadAll();
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    private registerChangeInRoles() {
        this.eventSubscriber = this.eventManager.subscribe('roleListModification', () => this.loadAll());
    }

    loadAll() {
        this.roleOptions.showLoader = true;
        this.roleService.getRoles()
            .subscribe(
                (result) => {
                    this.updateRolesList(result);
                    this.roleOptions.queryCount = this.roleOptions.totalItems = result.length;
                    if (this.roleOptions.page > 1) {
                        const length = parseInt(this.roleOptions.queryCount / this.roleOptions.itemsPerPage + '', 10)
                            + (this.roleOptions.queryCount % this.roleOptions.itemsPerPage ? 1 : 0);
                        if (this.roleOptions.page > length) {
                            this.roleOptions.page = length;
                            this.roleOptions.previousPage = null;
                        }
                    }
                },
                (res: Response) => this.onError(res),
                () => this.roleOptions.showLoader = false
            );
    }

    onLoadPage(page: number) {
        if (page !== this.roleOptions.previousPage) {
            this.roleOptions.previousPage = page;
        }
    }

    onTransition() {
        this.loadAll();
    }

    onChangePerPage() {
        this.roleOptions.previousPage = null;
        this.onLoadPage(this.roleOptions.page);
    }

    private updateRolesList(data: Role[]): void {
        this.store.dispatch(new PopulateRoles(this.orderByPipe.transform(data, this.roleOptions.predicate, !this.roleOptions.reverse)));
        this.store.dispatch(new GetRolesByPage(this.roleOptions.page));
    }

    private onError(resp) {
        try {
            const res = resp.body || {};
            this.alertService.error(res.error_description, res.params)
        } catch (e) {
        }
    }

    public onAdd() {
        this.modalService.open(RoleMgmtDialogComponent, { backdrop: 'static' });
    }

    public onEdit(role) {
        const modalRef = this.modalService.open(RoleMgmtDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedRole = role;
    }

    public onDelete(role) {
        const modalRef = this.modalService.open(RoleMgmtDeleteDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedRole = role;
    }
}
