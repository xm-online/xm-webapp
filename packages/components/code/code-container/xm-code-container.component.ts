import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-code-container',
    styleUrls: ['./xm-code-container.scss'],
    host: {
        class: 'xm-code-container',
    },
    template: `
        <ng-content></ng-content>
        <xm-copy-icon [value]="copyValue"
                      class="xm-code-container-copy-icon"></xm-copy-icon>
    `,
})
export class XmCodeContainerComponent {
    @Input() public copyValue: unknown;
}
