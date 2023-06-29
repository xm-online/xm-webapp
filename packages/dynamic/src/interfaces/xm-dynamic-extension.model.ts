import { XmDynamicWithSelector } from '@xm-ngx/dynamic/src/interfaces/xm-dynamic-selector';

export interface XmDynamicExtensionConstructor<T> {
    new(...args: any[]): T;
}

export interface XmDynamicExtensionEntry<T = unknown> extends XmDynamicWithSelector {
    loadChildren: () => Promise<XmDynamicExtensionConstructor<T>>;
}
