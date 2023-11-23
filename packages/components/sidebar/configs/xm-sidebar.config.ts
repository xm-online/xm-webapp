import { InjectionToken } from '@angular/core';
import {
    XM_SIDEBAR_DEFAULT_STATE,
    XmSidebarState,
} from '../stores/xm-sidebar.state';

export interface XmSidebarConfig {
    defaultState: XmSidebarState,
}

export const XM_SIDEBAR_CONFIG: InjectionToken<XmSidebarConfig> = new InjectionToken<XmSidebarConfig>('XM_SIDEBAR_CONFIG');

export const XM_SIDEBAR_CONFIG_DEFAULT: XmSidebarConfig = {
    defaultState: XM_SIDEBAR_DEFAULT_STATE,
};
