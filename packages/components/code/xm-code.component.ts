import { Component, Input } from '@angular/core';

@Component({
    selector: 'xm-code',
    template: `
        <code class="mat-body-2"
              [ngClass]="{'d-block': isBlock !== undefined && isBlock !== false}">
            <ng-content></ng-content>
        </code>`,
})
export class XmCodeComponent {
    @Input() public isBlock: boolean | unknown | '';
}
