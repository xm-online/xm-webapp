import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';

import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { Spec } from '@xm-ngx/core/entity';
import { XmEntitySpec } from '@xm-ngx/core/entity';
import { EntityUiConfig } from '@xm-ngx/core/config';
import { Principal } from '@xm-ngx/core/user';
import { XM_ENTITY_EVENT_LIST } from '../constants';

@Component({
    selector: 'xm-entity-list-fab',
    templateUrl: './entity-list-fab.component.html',
})
export class EntityListFabComponent {

    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public spec: Spec;
    @Input() public uiConfig: any;

    public showAddButton: boolean;

    constructor(private eventManager: XmEventManager,
                private modalService: MatDialog,
                private principal: Principal,
    ) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.showAddButton = true;

        const currentKey = changes.xmEntitySpec.currentValue.key;
        const entities: EntityUiConfig[] = this.uiConfig?.applications
            && this.uiConfig.applications.config
            && this.uiConfig.applications.config.entities;

        if (currentKey && entities && entities.length > 0) {
            entities.forEach((el: EntityUiConfig) => {
                if (el.typeKey === currentKey) {
                    this.checkEntityAddPermission(el);
                }
            });
        }
    }

    public onRefresh(): void {
        this.eventManager.broadcast({name: XM_ENTITY_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION});
    }

    public onAddNew(): void {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, { minWidth: '500px' });
        modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        modalRef.componentInstance.spec = this.spec;
    }

    private checkEntityAddPermission(config: EntityUiConfig): void {
        if (config.addButtonPermission) {
            this.showAddButton = false;
            this.principal.hasPrivileges([config.addButtonPermission]).then((result) => {
                if (result) {
                    this.showAddButton = true;
                }
            });
        }
    }

}
