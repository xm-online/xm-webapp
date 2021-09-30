import {
    XmSidebarAlignType,
    XmSidebarBackdropType,
    XmSidebarPresentationType,
    XmSidebarState,
} from '@xm-ngx/components/sidebar';

export enum XmNavbarOpenState {
    Open = 1,
    Close,
}

export interface XmNavbarBreakpointState {
    [XmNavbarOpenState.Open]: XmSidebarState;
    [XmNavbarOpenState.Close]: XmSidebarState;
}

export enum XmNavbarBreakpoint {
    Handset = 1,
    Tablet,
    Web
}

export interface XmNavbarBreakpointConfig {
    [XmNavbarBreakpoint.Handset]: XmNavbarBreakpointState,
    [XmNavbarBreakpoint.Tablet]: XmNavbarBreakpointState,
    [XmNavbarBreakpoint.Web]: XmNavbarBreakpointState,
}

export const XM_NAVBAR_BREAKPOINT_CONFIG_DEFAULT: XmNavbarBreakpointConfig = {
    [XmNavbarBreakpoint.Handset]: {
        [XmNavbarOpenState.Open]: {
            presentationType: XmSidebarPresentationType.Open,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
        [XmNavbarOpenState.Close]: {
            presentationType: XmSidebarPresentationType.Close,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
    },
    [XmNavbarBreakpoint.Tablet]: {
        [XmNavbarOpenState.Open]: {
            presentationType: XmSidebarPresentationType.Open,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
        [XmNavbarOpenState.Close]: {
            presentationType: XmSidebarPresentationType.Tablet,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
    },
    [XmNavbarBreakpoint.Web]: {
        [XmNavbarOpenState.Open]: {
            presentationType: XmSidebarPresentationType.Open,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
        [XmNavbarOpenState.Close]: {
            presentationType: XmSidebarPresentationType.Tablet,
            alignType: XmSidebarAlignType.Embed,
            backdropType: XmSidebarBackdropType.None,
        },
    },
};
