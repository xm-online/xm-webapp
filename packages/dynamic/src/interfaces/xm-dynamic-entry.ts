import { NgModuleFactory } from '@angular/core';
import { XmDynamicConstructor } from './xm-dynamic-constructor';
import { XmDynamicEntryModule } from './xm-dynamic-entry-module';

export type XmDynamicNgModuleFactory<T> = NgModuleFactory<XmDynamicEntryModule<T>>;

/**
 * Use this interface to declare your dynamic component
 */
export interface XmDynamicEntry<T = unknown> {
    selector: string;
    loadChildren: () => XmDynamicConstructor<T>
        | XmDynamicNgModuleFactory<T>
        | Promise<XmDynamicConstructor<T> | XmDynamicNgModuleFactory<T>>;
}

/**
 * Aggregates {@link XmDynamicEntry}
 */
export type XmDynamicEntries = XmDynamicEntry[] | XmDynamicEntry[][];
