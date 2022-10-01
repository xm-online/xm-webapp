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
        // todo: deprecated solution. we need to search only by injection token, not random string;
        const componentInProvider = injector.get(selector, ELEMENT_NOT_FOUND);
        if (componentInProvider !== ELEMENT_NOT_FOUND) {
            return componentInProvider;
        }
        if (!selector.startsWith('@xm-ngx')) {
            try {
                const mselector = selector.split('/')[0];
                const module = await this.dynamicExtensionLoaderService.loadAndResolve(mselector.startsWith('ext-') ? mselector.slice(4) : mselector, injector);
                if (module?.injector) {
                    injector = module.injector;
                }
                const providerComponent = injector.get(selector.split('/')[1], ELEMENT_NOT_FOUND);
                if (providerComponent !== ELEMENT_NOT_FOUND) {
                    return {component: providerComponent, injector, module};
                }
            } catch (e) {
                console.error(e);
                injector = this.moduleRef.injector;
            }
        }
        const providers = injector.get(XM_DYNAMIC_ENTRIES, []);
        const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
        const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
        const component = components.find((i) => i.selector === componentSelector) || null;

        // if (injector) {
        //     if (injector.get(selector, ELEMENT_NOT_FOUND) !== ELEMENT_NOT_FOUND) {
        //         return injector.get(selector, ELEMENT_NOT_FOUND);
        //     }
        //
        // try {
        //     const module = await this.dynamicExtensionLoaderService.loadAndResolve(selector.split('/')[0], injector);
        //     if (module?.injector) {
        //         injector = module.injector;
        //     }
        // } catch (e) {
        //     console.error(e);
        //     injector = this.moduleRef.injector;
        // }
        // injector = this.moduleRef.injector;
        // }
        if (!component) {
            return null;
        }
        const loaded: any = await component.loadChildren();
        if (loaded && loaded.ɵmod) {
            const compiledModule: any = createNgModule(loaded, injector);
            if (compiledModule?.instance?.entry) {
                return {
                    component: compiledModule.instance.entry,
                    injector: compiledModule.injector,
                    module: compiledModule
                };
            }
            return {component: loaded, injector: compiledModule.injector, module: compiledModule};
        }


        if (this.isSelectorIncludesExtension(selector)) {
            injector = (await this.loadModule(selector, injector))?.injector || injector;
        }

        // const providers = injector.get(XM_DYNAMIC_ENTRIES, {});
        // // const registry = injector.get(XM_DYNAMIC_ENTRIES, {});
        // const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
        // const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
        // const component = components.find((i) => i.selector === componentSelector) || null;


        // const [module, component] = selector.includes('/') ? selector.split('/') : ['', selector];
        // const module = await this.dynamicExtensionLoaderService.loadAndResolve(selector.split('/')[0], injector);
        // if (module?.injector) {
        //     injector = module.injector;
        // }


        // verify is it component or not
        return {component: loaded, injector};
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
