import { Component } from '@angular/core';

@Component({
    selector: 'xm-table-header',
    host: { class: 'xm-table-header' },
    template: `
        <ng-content></ng-content>
    `,
    styles: [`
        :host(.xm-table-header) {
            display: flex;
            align-items: center;
            margin-left: 1rem;
            margin-right: 1rem;
        }
    `],
    standalone: true,
})
export class XmTableHeaderComponent {
}
