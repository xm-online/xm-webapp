import { animate, AnimationTriggerMetadata, group, query, style, transition, trigger } from '@angular/animations';

const fadeInUp = [
    style({ opacity: 0 }),
    animate('300ms 150ms ease-out', style({ opacity: 1 })),
    style({ }),
];

const fadeOutDown = [
    style({
        opacity: 1,
        position: 'absolute',
        transform: 'translateY(0)',
    }),
    animate('150ms ease-out', style({
        opacity: 0,
        position: 'absolute',
        transform: 'translateY(1rem)',
    })),
];

export const fadeInUpOutDown: AnimationTriggerMetadata = trigger('fadeInUpOutDown', [
    transition('* <=> *', [
        group([
            query(':enter', fadeInUp, { optional: true }),
            query(':leave', fadeOutDown, { optional: true }),
        ]),
    ]),
]);
