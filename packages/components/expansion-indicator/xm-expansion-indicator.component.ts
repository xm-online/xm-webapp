import { Component, EventEmitter, Input, Output } from '@angular/core';
import { matExpansionAnimations } from '@angular/material/expansion';

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
        matExpansionAnimations.indicatorRotate,
    ],
})
export class XmExpansionIndicatorComponent {
    @Input() public value: boolean;
    @Output() public valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
