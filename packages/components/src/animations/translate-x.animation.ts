import { animate, AnimationTriggerMetadata, group, query, style, transition, trigger } from '@angular/animations';

export const translateLeft: AnimationTriggerMetadata = trigger('translateLeft', [
    transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' })),
        group([
            query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' })),
            ]),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))]),
        ]),
    ]),
]);
