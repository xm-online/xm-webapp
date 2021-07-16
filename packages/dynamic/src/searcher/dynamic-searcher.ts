import { Injectable, Injector, Type } from '@angular/core';
import { XmDynamicEntry, XmDynamicNgModuleFactory } from '../interfaces';

@Injectable()
export abstract class DynamicSearcher {
    public abstract search<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null>;

    public abstract getEntry<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<XmDynamicEntry<T> | null>;
}
