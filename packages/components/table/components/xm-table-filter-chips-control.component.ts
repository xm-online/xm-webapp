import { Component, Input } from '@angular/core';
import {
    XmInlineControlComponent, XmInlineControlConfig,
} from '@xm-ngx/components/inline-control';
import { FormsModule } from '@angular/forms';
import { NgControlAccessor } from '@xm-ngx/components/ng-accessor';

@Component({
    standalone: true,
    selector: 'xm-table-filter-chips-control',
    imports: [XmInlineControlComponent, FormsModule],
    template: `
        <xm-inline-control [config]="config"
                           [ngModel]="value"
                           [disabled]="disabled"
                           (saveValue)="change($event)"></xm-inline-control>
    `,
})
export class XmTableFilterChipsControlComponent extends NgControlAccessor<unknown> {
    @Input() public config: XmInlineControlConfig;
}
