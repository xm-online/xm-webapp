import { Component, Input, NgModule } from '@angular/core';

import { StateSpec } from '../shared';
import { XmSharedModule } from '@xm-ngx/shared';

@Component({
    selector: 'xm-entity-state',
    templateUrl: './entity-state.component.html',
})
export class EntityStateComponent {
    @Input() public stateSpec: StateSpec;
}

@NgModule({
    imports: [XmSharedModule],
    exports: [EntityStateComponent],
    declarations: [EntityStateComponent],
    providers: []
})
export class EntityStateModule {
}
