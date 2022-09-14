import { ComponentFactory, Injectable, Injector, Type } from '@angular/core';
import { XmDynamicEntry } from '../interfaces';

@Injectable()
export abstract class DynamicLoader {
    public abstract load<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<Type<T> | null>;

    public abstract loadAndResolve<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<ComponentFactory<T> | null> ;

    public abstract getEntry<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<XmDynamicEntry<T> | null>;
}
