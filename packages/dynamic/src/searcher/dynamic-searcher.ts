import { Injectable, Injector, Type } from '@angular/core';
import { XmDynamicNgModuleFactory } from '../interfaces';

@Injectable()
export abstract class DynamicSearcher {
    public abstract search<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null>;
}
