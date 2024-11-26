import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { XmTopPanelAppearanceAnimationStateEnum } from './top-panel.model';

export const showHideTopPanel: AnimationTriggerMetadata = trigger('showHideTopPanel', [
    state(XmTopPanelAppearanceAnimationStateEnum.HIDE, style({
        opacity: 0,
        height: '0px',
        marginBottom: 0,
    })),
    state(XmTopPanelAppearanceAnimationStateEnum.SHOW, style({
        opacity: 1,
        height: '*',
        marginBottom: '{{marginBottom}}px',
    }), {params: { marginBottom: 0 } }),
    transition(
        `${XmTopPanelAppearanceAnimationStateEnum.SHOW} <=> ${XmTopPanelAppearanceAnimationStateEnum.HIDE}`,
        animate('{{duration}}ms ease-in-out'),
        {params: { duration: 250 } },
    ),
]);
