import {animate, animateChild, AnimationTriggerMetadata, query, style, transition, trigger} from '@angular/animations';

export const showHideSubCategories: AnimationTriggerMetadata = trigger('showHideSubCategories', [
    transition(':enter', [
        style({opacity: 0}),
        animate('150ms 100ms', style({opacity: 1})),
        query('@*', animateChild()),
    ]),
    transition(':leave', [
        style({opacity: 1}),
        animate('100ms', style({opacity: 0})),
    ]),
]);
