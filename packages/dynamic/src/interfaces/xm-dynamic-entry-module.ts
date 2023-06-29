import { XmDynamicConstructor } from './xm-dynamic-constructor';

/**
 * The base interface for all dynamic modules
 * @deprecated Will be removed in v5.0.0. Use standalone component instead.
 */
export interface XmDynamicEntryModule<T = unknown> {
    entry: XmDynamicConstructor<T>;
}
