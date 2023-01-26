import { Component } from '@angular/core';
import { XmTableComponent } from '@xm-ngx/components/table/table/xm-table.component';

@Component({
    selector: 'xm-table',
    template: `
        <xm-table></xm-table>
    `,
    standalone: true,
    imports: [XmTableComponent],
})
export class MockXmTableComponent {
}
