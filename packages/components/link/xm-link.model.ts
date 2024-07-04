import { XmLinkOptions } from './xm-link';
import { XmDynamicControllerDeclaration } from '@xm-ngx/dynamic';

export interface XmLinkSubtextConfig {
    /** Configuration for the `xm-link` component with extra field format */
    linkConfig: XmLinkOptionsWithFormat;
    /** Configuration for the dynamic component injection */
    subtext: XmLinkWithSubtextDynamicWidget;
    /**
     * String with class names you want to add to the parent div
     */
    class?: string;
    /**
     * String with the inline styles you want to add to the parent div
     */
    style?: string;
}

export interface XmLinkWithSubtextDynamicWidget {
    field: string;
    selector: string;
    class?: string;
    style?: string;
    controllers?: XmDynamicControllerDeclaration[];
    config: unknown;
}

export interface XmLinkOptionsWithFormat extends XmLinkOptions {
    format: {
        type: XmLinkValueFormat,
        pattern: string;
    };
}

export enum XmLinkValueFormat {
    DATE = 'date'
}
