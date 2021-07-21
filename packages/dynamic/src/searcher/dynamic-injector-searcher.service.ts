import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { XmDynamicEntry, XmDynamicNgModuleFactory } from '../interfaces';
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
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        const componentTypeOrLazyComponentType = options.injector.get(selector, ELEMENT_NOT_FOUND);
        if (componentTypeOrLazyComponentType === ELEMENT_NOT_FOUND) {
            return null;
        }

        if (componentTypeOrLazyComponentType instanceof Promise) {
            return componentTypeOrLazyComponentType;
        } 
        return Promise.resolve(componentTypeOrLazyComponentType);
        
    }

    public getEntry<T>(
        selector: string,
        options?: { injector?: Injector }): Promise<XmDynamicEntry<T> | null> {
        return Promise.resolve(null);
    }

}
