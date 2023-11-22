import { XmDynamicConstructor } from './xm-dynamic-constructor';

/**
 * The base interface for all dynamic modules
 */
export interface XmDynamicEntryModule<T = unknown> {
    entry: XmDynamicConstructor<T>;
}
