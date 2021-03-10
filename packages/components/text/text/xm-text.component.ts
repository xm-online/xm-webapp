import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

@Component({
    selector: 'xm-text',
    template: '{{value}}',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextComponent implements XmDynamicPresentation<Primitive, undefined> {
    @Input() public value: Primitive;
    @Input() public options: undefined;
}
