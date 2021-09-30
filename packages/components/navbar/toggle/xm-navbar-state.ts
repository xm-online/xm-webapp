import {
    XM_NAVBAR_BREAKPOINT_CONFIG_DEFAULT,
    XmNavbarBreakpoint,
    XmNavbarBreakpointState,
    XmNavbarOpenState,
} from './xm-navbar-breakpoint.config';

export interface XmNavbarState {
    openState: XmNavbarOpenState,
    navbarBreakpoint: XmNavbarBreakpointState
}

export const XM_NAVBAR_STATE_CONFIG_DEFAULT: XmNavbarState = {
    openState: XmNavbarOpenState.Open,
    navbarBreakpoint: XM_NAVBAR_BREAKPOINT_CONFIG_DEFAULT[XmNavbarBreakpoint.Web],
};
