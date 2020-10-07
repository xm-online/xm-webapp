import { animate, AnimationTriggerMetadata, group, query, style, transition, trigger } from '@angular/animations';

const fadeIn = [
    style({ opacity: 0 }),
    animate('300ms ease-out', style({ opacity: 1 })),
    style({}),
];

const fadeOut = [
    style({ opacity: 1 }),
    animate('300ms ease-out', style({ opacity: 0 })),
    style({}),
];

export const fadeInOut: AnimationTriggerMetadata = trigger('fadeInOut', [
    transition('* <=> *', [
        group([
            query(':enter', fadeIn, { optional: true }),
            query(':leave', fadeOut, { optional: true }),
        ]),
    ]),
]);
