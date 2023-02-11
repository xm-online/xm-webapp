import { Component, Input } from '@angular/core';
import {
    XmInlineControlComponent,
    XmInlineControlConfig
} from '@xm-ngx/components/inline-control/inline-control.component';
import { FormsModule } from '@angular/forms';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';

@Component({
    standalone: true,
    selector: 'xm-edit-control',
    imports: [XmInlineControlComponent, FormsModule],
    template: `
        <xm-inline-control [config]="config"
                           [ngModel]="value"></xm-inline-control>
    `,
})
export class XmTableControlComponent extends NgControlAccessor<unknown> {
    @Input() public config: XmInlineControlConfig;
}
