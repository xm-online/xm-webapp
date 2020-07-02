import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { DynamicNgModuleFactory } from '../dynamic.interfaces';
import { DynamicSearcher } from './dynamic-searcher';

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

@Injectable({
    providedIn: 'root',
})
export class DynamicInjectorSearcherService implements DynamicSearcher {

    constructor(
        private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = {injector: this.moduleRef.injector},
    ): Promise<DynamicNgModuleFactory<T> | Type<T> | null> {
        const componentTypeOrLazyComponentType = options.injector.get(selector, ELEMENT_NOT_FOUND);
        if (componentTypeOrLazyComponentType === ELEMENT_NOT_FOUND) {
            return null;
        }

        if (componentTypeOrLazyComponentType instanceof Promise) {
            return componentTypeOrLazyComponentType;
        } else {
            return Promise.resolve(componentTypeOrLazyComponentType);
        }
    }

}
