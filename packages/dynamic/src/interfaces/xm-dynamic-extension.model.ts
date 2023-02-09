export interface XmDynamicExtensionConstructor<T> {
    new(...args: any[]): T;
}

export interface XmDynamicExtensionEntry<T = unknown> {
    selector: string;
    loadChildren: () => Promise<XmDynamicExtensionConstructor<T>>;
}
