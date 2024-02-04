import {
    animate,
    animateChild,
    AnimationTriggerMetadata,
    query,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {MenuSubcategoriesAnimationStateEnum} from '@xm-ngx/components/menu/menu.model';

export const showHideSubCategories: AnimationTriggerMetadata = trigger('showHideSubCategories', [
    state(MenuSubcategoriesAnimationStateEnum.SHOW, style({opacity: 1})),
    state(MenuSubcategoriesAnimationStateEnum.HIDE, style({opacity: 0})),
    transition(`${MenuSubcategoriesAnimationStateEnum.HIDE} => ${MenuSubcategoriesAnimationStateEnum.SHOW}`, [
        animate('150ms 50ms'),
        query('@*', animateChild()),
    ]),
]);

export const hideCategories: AnimationTriggerMetadata = trigger('hideCategories', [
    transition(':leave', [
        style({transform: 'translateX(0)'}),
        animate('100ms 400ms', style({transform: 'translateX(-100%)'})),
    ]),
]);
