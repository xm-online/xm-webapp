import { animate, state, style, transition, trigger } from '@angular/animations';

export const TableExpand = trigger('tableExpand', [
    state('collapsed', style({height: '0px', minHeight: '0'})),
    state('expanded', style({height: '*'})),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);

export const TableHeaderSelection = trigger('fadeInOut', [
    transition(':enter', [style({opacity: 0}), animate('250ms')]),
    transition(':leave', [animate('150ms')]),
]);
