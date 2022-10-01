import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import * as _ from 'lodash';
import { tail } from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicEntries, XmDynamicEntry } from '../interfaces';
import { DynamicExtensionLoaderService } from './dynamic-extension-loader.service';

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

export interface DynamicComponentLoaderGetReturnValue {
    component: Type<any>,
    injector?: Injector,
    module?: NgModuleRef<any>
}

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
        injector: Injector = this.moduleRef.injector,
    ): Promise<DynamicComponentLoaderGetReturnValue | null> {

        const isStickySelector = (selector: string): boolean => {
            return selector.startsWith('@xm-ngx/') || !this.isSelectorIncludesExtension(selector);
        };

        const module = !isStickySelector(selector) ? await this.loadModule(selector, injector) : null;

        const targetInjector = module?.injector || injector;

        // TODO: Angular does not allow search/store something inside injector by string valued key.
        // Deprecated!! Solution 1: get component by selector in provider.
        // Example: providers: [{provide: 'my-selector', useValue: MyComponent}]
        // todo: deprecated solution. we need to search only by injection token, not random string;
        const componentInProviderr = targetInjector.get(isStickySelector(selector) ? selector : selector.split('/')[1], ELEMENT_NOT_FOUND);
        if (componentInProviderr !== ELEMENT_NOT_FOUND) {
            return {
                component: componentInProviderr,
                injector: targetInjector,
                module
            };
        }


        // TODO: components will be inside object, not array.
        const providers = targetInjector.get(XM_DYNAMIC_ENTRIES, []);
        const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
        const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
        const component = components.find((i) => i.selector === componentSelector) || null;

        if (!component) {
            return null;
        }
        const loaded: any = await component.loadChildren();
        if (loaded && loaded.ɵmod) {
            const compiledModule: any = createNgModule(loaded, injector);
            if (compiledModule?.instance?.entry) {
                console.warn(`Deprecated solution. Make ${selector} standalone component`);
                return {
                    component: compiledModule.instance.entry,
                    injector: compiledModule.injector,
                    module: compiledModule
                };
            }
            return {component: loaded, injector: compiledModule.injector, module: compiledModule};
        }

        return {component: loaded, injector: targetInjector};
    }

    private isSelectorIncludesExtension(selector: string): boolean {
        return selector.includes('/');
    }

    private loadModule(selector: string, injector: Injector): any {
        const mselector = selector.split('/')[0];
        // Deprecated! all selectors should not contain 'ext-' prefix.
        return this.dynamicExtensionLoaderService.loadAndResolve(mselector.startsWith('ext-') ? mselector.slice(4) : mselector, injector);
    }
}
