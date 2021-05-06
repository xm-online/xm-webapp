import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { XmEventManager } from '@xm-ngx/core';

import { XM_EVENT_LIST } from '../../xm.constants';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';
import { Spec } from '../shared/spec.model';
import { XmEntitySpec } from '../shared/xm-entity-spec.model';

@Component({
    selector: 'xm-entity-list-fab',
    templateUrl: './entity-list-fab.component.html',
})
export class EntityListFabComponent {

    @Input() public xmEntitySpec: XmEntitySpec;
    @Input() public spec: Spec;

    constructor(private eventManager: XmEventManager,
                private modalService: MatDialog) {
    }

    public onRefresh(): void {
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_ENTITY_LIST_MODIFICATION});
    }

    public onAddNew(): void {
        const modalRef = this.modalService.open(EntityDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        modalRef.componentInstance.spec = this.spec;
    }

}
