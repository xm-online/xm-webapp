import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { ContextService } from '@xm-ngx/core/context';
import { XmEntityService } from '@xm-ngx/core/entity';

import { Principal } from '@xm-ngx/core/user';
import { FunctionListSectionComponent } from '../function-list-section/function-list-section.component';

@Component({
    selector: 'xm-function-list-section-compact',
    templateUrl: './function-list-section-compact.component.html',
    styleUrls: ['./function-list-section-compact.component.scss'],
    standalone: false,
})
export class FunctionListSectionCompactComponent extends FunctionListSectionComponent {

    constructor(protected xmEntityService: XmEntityService,
                protected modalService: MatDialog,
                protected eventManager: XmEventManager,
                protected translateService: TranslateService,
                protected contextService: ContextService,
                protected principal: Principal) {
        super(xmEntityService, modalService, eventManager, translateService, contextService, principal);
    }

}
