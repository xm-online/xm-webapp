import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { XmTopPanelAppearanceAnimationStateEnum, XmTopPanelAppearanceTimings } from './top-panel.model';

export const showHideTopPanel: AnimationTriggerMetadata = trigger('showHideTopPanel', [
    state(XmTopPanelAppearanceAnimationStateEnum.HIDE, style({transform: 'translateY(-100%)'})),
    state(XmTopPanelAppearanceAnimationStateEnum.SHOW, style({transform: 'translateY(0)'})),
    transition(`${XmTopPanelAppearanceAnimationStateEnum.SHOW} <=> ${XmTopPanelAppearanceAnimationStateEnum.HIDE}`, [
        animate(`${XmTopPanelAppearanceTimings.DEFAULT_TRANSITION}ms ease-in-out`),
    ]),
]);
