import { createNgModule, Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { tail } from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
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

    private cache: Record<string, Promise<DynamicComponentLoaderGetReturnValue | null> | DynamicComponentLoaderGetReturnValue | null> = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicExtensionLoaderService: DynamicExtensionLoaderService,
    ) {
    }

    // define return type
    public async get<T>(selector: string, injector: Injector = this.moduleRef.injector): Promise<DynamicComponentLoaderGetReturnValue | null> {
        if (!this.cache[selector]) {
            this.cache[selector] = new Promise(async (resolve, reject) => {
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
                    const result = {
                        component: componentInProviderr,
                        injector: targetInjector,
                        module
                    };
                    this.cache[selector] = result;
                    resolve(result);
                    return;
                }

                const componentSelector = selector.includes('/') && !selector.startsWith('@xm-ngx') ? tail(selector.split('/')).join('/') : selector;
                const type = 'any';
                const temp = targetInjector.get(XM_DYNAMIC_ENTRIES, {});
                const components = Object.assign({}, ...temp);
                const component = (components[type] && components[type][componentSelector]) || components['any'][componentSelector];
                // TODO: components will be inside object, not array.
                // const providers = targetInjector.get(XM_DYNAMIC_ENTRIES, []);
                // const components = _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
                // const component = components.find((i) => i.selector === componentSelector) || null;

                if (!component) {
                    const result = null;
                    this.cache[selector] = result;
                    resolve(result);
                    return;
                }
                const loaded: any = await component.loadChildren();

                if (loaded && loaded.ɵmod) {
                    const compiledModule: any = createNgModule(loaded, injector);
                    if (compiledModule?.instance?.entry) {
                        console.warn(`Deprecated solution. Make ${selector} standalone component`);
                        const result = {
                            component: compiledModule.instance.entry,
                            injector: compiledModule.injector,
                            module: compiledModule
                        };

                        this.cache[selector] = result;
                        resolve(result);
                        return;
                    }
                    const result = {component: loaded, injector: compiledModule.injector, module: compiledModule};

                    this.cache[selector] = result;
                    resolve(result);
                    return;
                }

                const result = {component: loaded, injector: targetInjector};
                this.cache[selector] = result;
                resolve(result);
            });
        }
        return this.cache[selector];
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
