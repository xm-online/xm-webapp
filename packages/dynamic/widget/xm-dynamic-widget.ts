import { XmDynamicWithConfig } from '../src/interfaces';

/**
 * Use this interface when you need to create a dynamic widget
 * @public
 */
export interface XmDynamicWidget<C = unknown> extends XmDynamicWithConfig<C>{
    /** @deprecated spec will be removed, you should provide the spec locally */
    spec?: unknown;
    readme?: {
        default?: string;
    };
}
