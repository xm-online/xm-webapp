import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

const indicatorRotate = trigger('indicatorRotate', [
    state('collapsed, void', style({ transform: 'rotate(0deg)' })),
    state('expanded', style({ transform: 'rotate(180deg)' })),
    transition('expanded <=> collapsed, void => collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
]);

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
        indicatorRotate,
    ],
    standalone: false,
})
export class XmExpansionIndicatorComponent {
    @Input() public value: boolean;
    @Output() public valueChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
