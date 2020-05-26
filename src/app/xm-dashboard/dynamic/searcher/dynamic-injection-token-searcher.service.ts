import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import * as _ from 'lodash';
import { DYNAMIC_COMPONENTS } from '../dynamic.injectors';
import { DynamicNgModuleFactory } from '../dynamic.interfaces';
import { DynamicSearcher } from './dynamic-searcher';

@Injectable({
    providedIn: 'root',
})
export class DynamicInjectionTokenSearcherService implements DynamicSearcher {

    constructor(
        private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = {injector: this.moduleRef.injector},
    ): Promise<DynamicNgModuleFactory<T> | Type<T> | null> {
        const providers = options.injector.get(DYNAMIC_COMPONENTS, []);
        const components = _.flatMap(providers);
        const component = components.find((i) => i.selector === selector)
            || {loadChildren: () => Promise.resolve(null)};
        return component.loadChildren();
    }

}
