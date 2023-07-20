import { XmDynamicWithSelector } from '../interfaces/xm-dynamic-selector';

export interface XmDynamicExtensionConstructor<T> {
    new(...args: any[]): T;
}

export interface XmDynamicExtensionEntry<T = unknown> extends XmDynamicWithSelector {
    loadChildren: () => Promise<XmDynamicExtensionConstructor<T>>;
}
