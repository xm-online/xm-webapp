import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { XmDynamicPresentation } from '@xm-ngx/dynamic';
import { Primitive } from '@xm-ngx/interfaces';
import { XmTemplatePipe } from '@xm-ngx/pipes';

export interface XmTextConfig {
    template?: string;
    preLine?: boolean;
}

@Component({
    selector: 'xm-text',
    template: '{{value | xmTemplate : config?.template}}',
    styles: `
      :host.pre-line {
          white-space: pre-line;
      }
    `,
    imports: [XmTemplatePipe],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class XmTextComponent implements XmDynamicPresentation<Primitive, XmTextConfig>, OnInit {
    @Input() public value: Primitive;
    @Input() public config: XmTextConfig | null;
    @HostBinding('class.pre-line') public isPreLine: boolean = false;

    public ngOnInit(): void {
        this.isPreLine = this.config?.preLine || false;
    }
}
