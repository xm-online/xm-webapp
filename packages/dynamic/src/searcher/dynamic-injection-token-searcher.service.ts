import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import * as _ from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicEntries, XmDynamicNgModuleFactory } from '../interfaces';
import { DynamicSearcher } from './dynamic-searcher';

@Injectable({
    providedIn: 'root',
})
export class DynamicInjectionTokenSearcherService implements DynamicSearcher {

    private global: XmDynamicEntries;

    constructor(
        private moduleRef: NgModuleRef<unknown>,
    ) {
        this.global = this.moduleRef.injector.get(XM_DYNAMIC_ENTRIES, []);
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        const providers = options.injector.get(XM_DYNAMIC_ENTRIES, []);
        const components = _.flatMap([...providers, ...this.global]);
        const component = components.find((i) => i.selector === selector)
            || { loadChildren: () => Promise.resolve(null) };
        return component.loadChildren();
    }

}
