export interface XmSidebarState {
    presentationType: XmSidebarPresentationType;
    alignType: XmSidebarAlignType,
}

export enum XmSidebarPresentationType {
    Open = 1,
    Close,
    Tablet,
}

export enum XmSidebarAlignType {
    Float = 1,
    Embed,
}

export const XM_SIDEBAR_DEFAULT_STATE: XmSidebarState = {
    presentationType: XmSidebarPresentationType.Open,
    alignType: XmSidebarAlignType.Embed,
};
