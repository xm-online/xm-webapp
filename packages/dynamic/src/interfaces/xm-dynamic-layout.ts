import { XmDynamicWithConfig, XmDynamicWithSelector } from './xm-dynamic-selector';
import { XmConfig } from '@xm-ngx/interfaces';

export interface XmLayoutNode {
    class?: string;
    style?: string;
}

export interface XmDynamicLayoutNode<C = XmConfig>
    extends XmDynamicWithConfig<C>,
        XmDynamicWithSelector,
        XmLayoutNode {
}

/**
 * @deprecated use XmDynamicLayout instead. will be remove in 6.0.0 version.
 */
export interface XmLayout<C = XmConfig> {
    content?: XmLayout[];
    selector: string;
    class?: string;
    style?: string;
}

/**
 * Use this interface to describe a layout
 */
export interface XmDynamicLayout<C = XmConfig> extends XmLayout<C>, XmDynamicLayoutNode<C> {
    content?: XmDynamicLayout[];
}

export interface XmSanitizedLayout {
    layout: XmDynamicLayout;
    isCustomElement: boolean;
    customParams: unknown;
}
