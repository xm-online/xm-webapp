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
import { MenuSubcategoriesAnimationStateEnum } from './menu.model';

export const showHideSubCategoriesDesktop: AnimationTriggerMetadata = trigger('showHideSubCategoriesDesktop', [
    state(MenuSubcategoriesAnimationStateEnum.SHOW, style({opacity: 1})),
    state(MenuSubcategoriesAnimationStateEnum.HIDE, style({opacity: 0})),
    transition(`${MenuSubcategoriesAnimationStateEnum.HIDE} => ${MenuSubcategoriesAnimationStateEnum.SHOW}`, [
        animate('150ms 50ms'),
        query('@*', animateChild(), {optional: true}),
    ]),
]);

export const showHideSubCategoriesMobile: AnimationTriggerMetadata = trigger('showHideSubCategoriesMobile', [
    transition(':enter', [
        style({opacity: 0, transform: 'translateX(10px)'}),
        animate('120ms', style({opacity: 1, transform: 'translateX(0)'})),
        query('@*', animateChild(), {optional: true}),
    ]),
    transition(':leave', [
        style({opacity: 1, transform: 'translateX(0)'}),
        animate('120ms', style({opacity: 0, transform: 'translateX(10px)'})),
    ]),
]);

export const hideCategories: AnimationTriggerMetadata = trigger('hideCategories', [
    transition(':enter', [
        style({opacity: 0, transform: 'translateX(-15px)', position: 'absolute'}),
        animate('100ms', style({opacity: 1, transform: 'translateX(0)', position: 'absolute'})),
    ]),
    transition(':leave', [
        style({opacity: 1, transform: 'translateX(0)', position: 'absolute'}),
        animate('100ms', style({opacity: 0, transform: 'translateX(-15px)', position: 'absolute'})),
    ]),
]);
