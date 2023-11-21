import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { ReplaySubject, Subscription } from 'rxjs';
import { Principal } from '@xm-ngx/core/user';

import {
    EntityDetailDialogComponent,
    Spec,
    XmEntity,
    XmEntitySpec,
    XmEntitySpecWrapperService,
} from '@xm-ngx/entity';
import { FunctionCallDialogComponent } from '@xm-ngx/entity';
import { pluck, takeUntil } from 'rxjs/operators';

const XM_EVENT_LIST = {
    XM_FUNCTION_CALL_SUCCESS: 'xm.functionCall.success',
    XM_ENTITY_LIST_MODIFICATION: 'xmEntityListModification',
    XM_ENTITY_LIST_SELECTION_CHANGED: 'xmEntityListSelection',
};


const ENTITY_SELECTED = 'xm-entity-selected';

@Component({
    selector: 'xm-entity-fab-actions',
    templateUrl: './entity-fab-actions.component.html',
    styleUrls: ['./entity-fab-actions.component.scss'],
})
export class EntityFabActionsComponent implements OnInit, OnDestroy {

    public selectedEntity: Subscription;
    public createEntity: Subscription;
    @Input() public config: any;
    public buttons: any [] = [];
    public mainButton: any;
    public role: string;
    public spec: Spec;
    public selectedNode: XmEntity;
    public fabButtonContext: any;
    public entityId: any;
    public entityType: string;
    public routingUrl: string;
    public xmEntityListSelection!: XmEntity[];

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private principal: Principal,
        private router: Router,
        protected translateService: TranslateService,
        protected toasterService: XmToasterService,
        protected modalService: MatDialog,
        protected eventManager: XmEventManager,
        protected xmEntitySpecWrapperService: XmEntitySpecWrapperService,
    ) {
        this.spec = null;
        this.eventManager.listenTo(XM_EVENT_LIST.XM_ENTITY_LIST_SELECTION_CHANGED)
            .pipe(
                pluck('payload', XM_EVENT_LIST.XM_ENTITY_LIST_SELECTION_CHANGED),
                takeUntil(this.destroyed$),
            )
            .subscribe((selected: unknown) => {
                this.xmEntityListSelection = selected as XmEntity[];
            });
    }

    public ngOnInit(): void {
        this.selectedEntity = this.eventManager.subscribe(ENTITY_SELECTED, (entity) => {
            if (entity) {
                this.selectedNode = entity.body;
                this.fabButtonContext = this.selectedNode;
            }
        });

        this.createEntity = this.eventManager.subscribe(XM_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION, (event) => {
            if (event) {
                this.entityId = event.entityId;
                this.entityType = event.entityType;
            }
        });

        this.principal.identity().then((role) => {
            this.role = role.roleKey;
            this.buttons = this.config ? this.config.buttons : this.config;
            this.mainButton = this.config ? this.config.mainButton : null;
            this.xmEntitySpecWrapperService.spec().then((spec) => {
                this.spec = spec;
            });
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.selectedEntity);
        this.eventManager.destroy(this.createEntity);
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public onAddNew(item: any): void {
        this.routingUrl = item.routingUrl || null;
        if (!item.typeKey || !this.spec) {
            return;
        }
        if (item.funcKey && item.typeKey) {
            this.callFunctionAction(item.typeKey, item.funcKey);
        } else {
            this.callEntityDetailAction(item.typeKey);
        }
    }

    public onRouterAction(button: any): void {
        const path = button.routerPath;
        const options = button.routerData;
        if (button && button.routerPath) {
            this.navigate(path, options);
        }
    }

    public getType(typeKey: string): XmEntitySpec {
        return this.spec.types.filter((t) => t.key === typeKey).shift();
    }

    public callEntityDetailAction(key: string): any {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntitySpec = this.getType(key);
        modalRef.componentInstance.spec = this.spec;
        modalRef.componentInstance.onSuccess = () => {
            if (this.routingUrl) {
                const path = `application/${this.entityType}/${this.entityId}`; // by default leads to application

                this.routingUrl.match(/dashboard/)
                    ? this.navigate(this.routingUrl, {id: this.entityId})
                    : this.navigate(path, {});
                return;
            }
            this.toasterService.success('ext-common-entity.entity-fab-actions.operation-success');
        };
        return modalRef;
    }

    public callFunctionAction(key: string, funcName: string): any {
        const entitySpec = this.spec.types.filter((x) => x.key === key).shift();

        const functionSpecArray = entitySpec.functions || [];
        const functionSpec = functionSpecArray.filter((x) => x.key === funcName).shift();
        const title = functionSpec.actionName ? functionSpec.actionName : functionSpec.name;
        const modalRef = this.modalService.open(FunctionCallDialogComponent, {width: '500px'});

        // setup xmEntity only if selected
        if (this.selectedNode) {
            modalRef.componentInstance.xmEntity = this.selectedNode;
        }

        modalRef.componentInstance.functionSpec = functionSpec;
        modalRef.componentInstance.dialogTitle = title;
        modalRef.componentInstance.buttonTitle = title;
        modalRef.componentInstance.listSelection = this.xmEntityListSelection;
        modalRef.componentInstance.onSuccess = () => {
            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_FUNCTION_CALL_SUCCESS});
            this.toasterService.success('ext-common-entity.entity-fab-actions.operation-success');
        };

        return modalRef;
    }

    private navigate(path: string, options: any): void {
        this.router.navigate([path], {queryParams: options});
    }
}
