import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'xm-text',
    template: `
        <label class="xm-text-view--label">
            <ng-content select="[xmLabel]"></ng-content>
        </label>
        <p class="xm-text-view--value">
            <ng-content select="[xmValue]"></ng-content>
        </p>
    `,
    styleUrls: ['./xm-text-view.scss'],
})
export class XmTextComponent {
    @Input() @HostBinding('class.inline') public styleInline: boolean;
}
