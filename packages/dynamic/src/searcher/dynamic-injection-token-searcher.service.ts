import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import * as _ from 'lodash';
import { DYNAMIC_COMPONENTS } from '../dynamic.injectors';
import { DynamicComponents, DynamicNgModuleFactory } from '../dynamic.interfaces';
import { DynamicSearcher } from './dynamic-searcher';

@Injectable({
    providedIn: 'root',
})
export class DynamicInjectionTokenSearcherService implements DynamicSearcher {

    private global: DynamicComponents;

    constructor(
        private moduleRef: NgModuleRef<unknown>,
    ) {
        this.global = this.moduleRef.injector.get(DYNAMIC_COMPONENTS, []);
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
    ): Promise<DynamicNgModuleFactory<T> | Type<T> | null> {
        const providers = options.injector.get(DYNAMIC_COMPONENTS, []);
        const components = _.flatMap([...providers, ...this.global]);
        const component = components.find((i) => i.selector === selector)
            || { loadChildren: () => Promise.resolve(null) };
        return component.loadChildren();
    }

}
