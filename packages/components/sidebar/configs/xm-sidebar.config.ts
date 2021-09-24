
import { InjectionToken } from '@angular/core';
import {
    XM_SIDEBAR_DEFAULT_STATE,
    XmSidebarPresentationType,
    XmSidebarState,
} from '../stores/xm-sidebar.state';

export interface XmSidebarConfig {
    defaultCloseType: XmSidebarPresentationType;
    defaultState: XmSidebarState,
    openBackdropType?: 'Blur' | 'Blackout';
}

export const XM_SIDEBAR_CONFIG: InjectionToken<XmSidebarConfig> = new InjectionToken<XmSidebarConfig>('XM_SIDEBAR_CONFIG');

export const XM_SIDEBAR_CONFIG_DEFAULT: XmSidebarConfig = {
    defaultCloseType: XmSidebarPresentationType.Tablet,
    defaultState: XM_SIDEBAR_DEFAULT_STATE,
};

