import { XmConfig } from '@xm-ngx/interfaces';
import { XmDynamic } from './xm-dynamic';

export type XmDynamicSelector = string;

export interface XmDynamicWithSelector {
    selector: XmDynamicSelector
}

/**
 * @deprecated Will be removed in v6.0.0. Use standalone component instead.
 * Determines input(control) options.
 **/
interface XmWithOptions<O> {
    /**
     * @deprecated Will be removed in v6.0.0. Use config instead.
     * Input options.
     **/
    options?: O;
}

export interface XmDynamicWithConfig<C = XmConfig>
    extends XmDynamic, XmWithOptions<C> {
    config?: C;
}
