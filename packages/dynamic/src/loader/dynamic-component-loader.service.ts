import { Injectable, Injector, NgModuleRef } from '@angular/core';
import * as _ from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicEntries, XmDynamicEntry } from '../interfaces';
import { DynamicExtensionLoaderService } from './dynamic-extension-loader.service';

@Injectable({
    providedIn: 'root',
})
export class DynamicComponentLoaderService {

    private readonly global: XmDynamicEntries;

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicExtensionLoaderService: DynamicExtensionLoaderService,
    ) {
        this.global = this.moduleRef.injector.get(XM_DYNAMIC_ENTRIES, []);
    }

    // define return type
    public async get<T>(
        selector: string,
        injector?: Injector,
    ): Promise<any | null> {
        // if (!injector) {
        const module = await this.dynamicExtensionLoaderService.loadAndResolve(selector.split('/')[0], injector);
        injector = module.injector;
        // injector = this.moduleRef.injector;
        // }
        const providers = injector.get(XM_DYNAMIC_ENTRIES, []);
        const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
        const component = components.find((i) => i.selector === selector) || null;
        return Promise.resolve(component ? component.loadChildren() : null);
    }
}
