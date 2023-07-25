import { NgModuleFactory } from '@angular/core';
import { XmDynamicConstructor } from './xm-dynamic-constructor';
import { XmDynamicEntryModule } from './xm-dynamic-entry-module';
import { XmDynamicWithSelector } from './xm-dynamic-selector';

export type XmDynamicNgModuleFactory<T> = NgModuleFactory<XmDynamicEntryModule<T>>;

/**
 * Use this interface to declare your dynamic component
 */
export interface XmDynamicEntry<T = unknown> extends XmDynamicWithSelector {
    type?: string;
    loadChildren: () => XmDynamicEntryConstructor<T>;
}

export type XmDynamicEntryConstructor<T> = XmDynamicConstructor<T>
    | XmDynamicNgModuleFactory<T>
    | Promise<XmDynamicConstructor<T> | XmDynamicNgModuleFactory<T>>;

/**
 * Aggregates {@link XmDynamicEntry}
 */
export type XmDynamicEntries = XmDynamicEntry[] | XmDynamicEntry[][];
