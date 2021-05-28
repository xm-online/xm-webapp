/**
 * Use this interface to describe a layout
 */
export interface XmLayout {
    content?: XmLayout[];
    selector: string;
    class?: string;
    style?: string;
}

export interface XmSanitizedLayout {
    layout: XmLayout;
    isCustomElement: boolean;
    customParams: unknown;
}
