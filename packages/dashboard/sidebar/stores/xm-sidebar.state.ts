export enum XmSidebarPresentationType {
    Open = 1,
    Close,
    Tablet,
}

export enum XmSidebarAlignType {
    Float = 1,
    Embed,
}

export enum XmSidebarBackdropType {
    None = 1,
    Blur,
    Blackout,
}

export interface XmSidebarState {
    presentationType: XmSidebarPresentationType;
    alignType: XmSidebarAlignType,
    backdropType: XmSidebarBackdropType,
}

export const XM_SIDEBAR_DEFAULT_STATE: XmSidebarState = {
    presentationType: XmSidebarPresentationType.Open,
    alignType: XmSidebarAlignType.Embed,
    backdropType: XmSidebarBackdropType.None,
};
