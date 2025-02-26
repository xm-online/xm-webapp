import { Component, Input, NgModule } from '@angular/core';

import { StateSpec } from '@xm-ngx/core/entity';
import { XmSharedModule } from '@xm-ngx/shared';
import { NgIf } from '@angular/common';

@Component({
    selector: 'xm-entity-state',
    templateUrl: './entity-state.component.html',
})
export class EntityStateComponent {
    @Input() public stateSpec: StateSpec;
}

@NgModule({
    imports: [XmSharedModule, NgIf],
    exports: [EntityStateComponent],
    declarations: [EntityStateComponent],
    providers: []
})
export class EntityStateModule {
}
