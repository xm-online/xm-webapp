import { Component, Input } from '@angular/core';
import { FormLayoutItem } from './xm-form-layout.component';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'xm-form-layout-control',
    template: `
    <ng-template [control]="control"
                 [formControl]="control"
                 [value]="control.value"
                 [options]="config.options"
                 [selector]="config.selector"
                 xmDynamicFormControl>
    </ng-template>
    `,
    imports: [XmDynamicModule, ReactiveFormsModule],
    standalone: true,
})
export class XmFormLayoutControl {
    @Input() public config: FormLayoutItem;
    @Input() public control: FormControl<unknown>;
}
