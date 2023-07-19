import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { XmDynamicModule, XmLayout } from '@xm-ngx/dynamic';
import { format } from '@xm-ngx/shared/operators';

export interface DynamicContextConfig {
    layouts: XmLayout[],
}

@Component({
    standalone: true,
    imports: [
        CommonModule,
        XmDynamicModule,
    ],
    selector: 'xm-dynamic-context',
    template: `
        <xm-dynamic-presentation-layout [layouts]="layouts"></xm-dynamic-presentation-layout>
    `,
})
export class DynamicContextComponent implements OnChanges {
    @Input() public config: DynamicContextConfig;
    @Input() public value: unknown;

    public layouts: XmLayout[] = [];

    public ngOnChanges(): void {
        if (!this.value) {
            this.layouts = this.config.layouts;
        }

        try {
            this.layouts = format(this.config.layouts, this.value);
        } catch (error) {
            console.warn(error);
        }
    }
}