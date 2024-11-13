import { XmDynamicLayout } from '@xm-ngx/dynamic';

export interface XmTopPanelAppearanceEvent {
    isTopPanel: boolean;
}

export interface XmTopPanelUIConfig {
    layout: XmDynamicLayout[];
}

export enum XmTopPanelAppearanceTimings {
    DEFAULT_TRANSITION = 300,
}

export enum XmTopPanelAppearanceAnimationStateEnum {
    SHOW = 'show',
    HIDE = 'hide',
}
