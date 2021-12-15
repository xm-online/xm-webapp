/**
 * Use this interface to describe a layout
 */
import { JavascriptCode } from '@xm-ngx/shared/interfaces';

export interface XmLayout {
    content?: XmLayout[];
    selector: string;
    class?: string;
    style?: string;
    condition?: JavascriptCode
}

export interface XmSanitizedLayout {
    layout: XmLayout;
    isCustomElement: boolean;
    customParams: unknown;
}
