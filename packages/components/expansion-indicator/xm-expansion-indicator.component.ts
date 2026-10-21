import { Component, EventEmitter, Input, Output } from '@angular/core';
import { xmExpansionAnimations } from '@xm-ngx/components/animations';

@Component({
    selector: 'xm-expansion-indicator',
    styleUrls: ['./xm-expansion-indicator.component.scss'],
    template: `
        <button (click)="valueChange.emit(value = !value)" mat-icon-button>
            <span [@indicatorRotate]="value ? 'expanded' : 'collapsed'"
                  class="xm-expansion-indicator-icon"></span>
        </button>
    `,
    animations: [
        xmExpansionAnimations.indicatorRotate,
    ],
    standalone: false,
})
export class XmExpansionIndicatorComponent {
    @Input() public value: boolean;
    @Output() public valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
