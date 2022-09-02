import { Injectable, Injector, Type } from '@angular/core';
import { XmDynamicEntry, XmDynamicEntryType, XmDynamicNgModuleFactory } from '../interfaces';

@Injectable()
export abstract class DynamicSearcher {
    public abstract search<T>(
        selector: string,
        options?: { injector?: Injector },
        type?: XmDynamicEntryType,
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null>;

    public abstract getEntry<T>(selector: string, options?: { injector?: Injector }, type?: XmDynamicEntryType): Promise<XmDynamicEntry<T> | null>;
}
