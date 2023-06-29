import { XmDynamicWithConfig, XmDynamicWithSelector } from './xm-dynamic-selector';
import { XmConfig } from '@xm-ngx/shared/interfaces';

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
 * Use this interface to describe a layout
 */
export interface XmDynamicLayout<C = XmConfig> extends XmDynamicLayoutNode<C> {
    content?: XmDynamicLayout[];
}

export interface XmSanitizedLayout {
    layout: XmDynamicLayout;
    isCustomElement: boolean;
    customParams: unknown;
}
