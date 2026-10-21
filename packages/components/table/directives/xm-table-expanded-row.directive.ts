import { Directive, Input, inject } from '@angular/core';
import { XM_DYNAMIC_TABLE_EXPANDED_ROW } from '@xm-ngx/dynamic';

@Directive({
    selector: '[xmTableExpandedRow]',
    standalone: true,
    providers: [{
        provide: XM_DYNAMIC_TABLE_EXPANDED_ROW,
        useFactory: () => inject(XmTableExpandedRowDirective).row,
    }],
})
export class XmTableExpandedRowDirective {
    @Input('xmTableExpandedRow') public row: unknown;
}
