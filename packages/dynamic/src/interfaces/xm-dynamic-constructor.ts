import { XmDynamic } from './xm-dynamic';

/**
 * Use this interface if you need to use the constructor of a dynamic component.
 */
export interface XmDynamicConstructor<T extends XmDynamic> {
    new(...args: any[]): T;
}
