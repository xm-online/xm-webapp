import { Injectable, Injector, Type } from '@angular/core';

import { DynamicNgModuleFactory } from '../dynamic.interfaces';

@Injectable({ providedIn: 'root' })
export abstract class DynamicSearcher {
    public abstract search<T>(
        selector: string,
        options: { injector?: Injector },
    ): Promise<DynamicNgModuleFactory<T> | Type<T> | null>;
}
