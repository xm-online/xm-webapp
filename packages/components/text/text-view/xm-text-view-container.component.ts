import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'xm-text-view-container',
    template: `
        <label class="xm-text-view--label" [style]="labelStyleInline">
            <ng-content select="[xmLabel]"></ng-content>
        </label>
        <p class="xm-text-view--value" [style]="valueStyleInline">
            <ng-content select="[xmValue]"></ng-content>
        </p>
    `,
    styleUrls: ['./xm-text-view-container.component.scss'],
    standalone: false,
})
export class XmTextViewContainerComponent {
    @Input() @HostBinding('class.inline') public styleInline: boolean;
    @Input() public labelStyleInline: string;
    @Input() public valueStyleInline: string;
}
