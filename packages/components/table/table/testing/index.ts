import { Component } from '@angular/core';
import { XmTableModule } from '@xm-ngx/components/table';

@Component({
    selector: 'xm-table',
    template: `
        <xm-table></xm-table>
    `,
    standalone: true,
    imports: [XmTableModule],
})
export class MockXmTableComponent {
}
