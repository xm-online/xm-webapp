import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IComponent } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

@Component({
    selector: 'xm-text',
    template: `{{value}}`,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextComponent implements IComponent<Primitive, undefined> {
    @Input() public value: Primitive;
    @Input() public options: undefined;
}
