import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/shared/interfaces';

export interface XmTextConfig {
    template?: string;
}

@Component({
    selector: 'xm-text',
    template: '{{value | template : config?.template}}',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextComponent implements XmDynamicPresentation<Primitive, XmTextConfig> {
    @Input() public value: Primitive;
    @Input() public config: XmTextConfig | null;
}
