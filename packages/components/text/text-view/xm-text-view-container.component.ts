import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'xm-text-view-container',
    template: `
        <label class="xm-text-view--label">
            <ng-content select="[xmLabel]"></ng-content>
        </label>
        <p class="xm-text-view--value">
            <ng-content select="[xmValue]"></ng-content>
        </p>
    `,
    styleUrls: ['./xm-text-view-container.component.scss'],
})
export class XmTextViewContainerComponent {
    @Input() @HostBinding('class.inline') public styleInline: boolean;
}
