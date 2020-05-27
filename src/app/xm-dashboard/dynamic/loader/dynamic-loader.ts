import { Injectable, Injector, Type } from '@angular/core';

@Injectable()
export abstract class DynamicLoader {
    abstract load<T>(
        selector: string,
        options?: { injector?: Injector },
    ): Promise<Type<T> | null>;
}
