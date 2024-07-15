import { Component, Input } from '@angular/core';
import { XmDynamicModule } from '@xm-ngx/dynamic';
import { XmRenderLayoutsConfig } from './render-layouts.interface';

@Component({
    standalone: true,
    selector: 'xm-layouts',
    template: `
        <xm-dynamic-presentation-layout [layouts]="config?.layouts"></xm-dynamic-presentation-layout>
    `,
    imports: [
        XmDynamicModule
    ]
})
export class XmRenderLayoutsComponent {
    @Input() public config: XmRenderLayoutsConfig;
}
