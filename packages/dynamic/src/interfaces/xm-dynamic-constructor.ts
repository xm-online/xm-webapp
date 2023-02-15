import { XmDynamic } from './xm-dynamic';
import { Type } from '@angular/core';

/**
 * Use this interface if you need to use the constructor of a dynamic component.
 */
export interface XmDynamicConstructor<T extends XmDynamic = XmDynamic>
    extends Type<T> {
    new (...args: any[]): T;
}
