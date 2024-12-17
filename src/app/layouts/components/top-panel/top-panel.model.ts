import { XmDynamicLayout } from '@xm-ngx/dynamic';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export interface XmTopPanelAppearanceEvent {
    isShown: boolean;
}

export interface XmTopPanelUIConfig {
    snackbar: XmTopPanelSnackbarConfig;
    animation: XmTopPanelAnimationConfig;
    layout: XmDynamicLayout[];
    position: 'on-top' | 'before-dashboard-content';
}

export interface XmTopPanelSnackbarConfig {
    selector: string;
    config: MatSnackBarConfig;
}

export interface XmTopPanelAnimationConfig {
    marginBottom: number;
    duration: number;
}

export enum XmTopPanelAppearanceAnimationStateEnum {
    SHOW = 'show',
    HIDE = 'hide',
}
