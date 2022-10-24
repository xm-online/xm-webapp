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
    public async get<T>(inSelector: string, injector: Injector = this.moduleRef.injector): Promise<DynamicComponentLoaderGetReturnValue | null> {
        const selector = this.simplifyExtSelector(inSelector);
        if (!this.cache[selector]) {
            this.cache[selector] = new Promise(async (resolve) => {

                const module = this.isExtSelector(selector) ? await this.loadModule(selector, injector) : null;

                const targetInjector = module?.injector || injector;

                const updateCache = (result) => {
                    this.cache[selector] = result;
                    resolve(result);
                    return;
                }

                this.handleProviderSolution();
                // TODO: Angular does not allow search/store something inside injector by string valued key.
                // Deprecated!! Solution 1: get component by selector in provider.
                // Example: providers: [{provide: 'my-selector', useValue: MyComponent}]
                // todo: deprecated solution. we need to search only by injection token, not random string;
                const componentInProviderr = targetInjector.get(!this.isExtSelector(selector) ? selector : selector.split('/')[1], ELEMENT_NOT_FOUND);
                if (componentInProviderr !== ELEMENT_NOT_FOUND) {
                    return updateCache({
                        component: componentInProviderr,
                        injector: targetInjector,
                        module
                    })
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
                    return updateCache(null);
                }
                const loaded: any = await component.loadChildren();

                if (loaded && loaded.ɵmod) {
                    const compiledModule: any = createNgModule(loaded, injector);
                    if (compiledModule?.instance?.entry) {
                        console.warn(`Deprecated solution. Make ${selector} standalone component`);
                        return updateCache({
                            component: compiledModule.instance.entry,
                            injector: compiledModule.injector,
                            module: compiledModule
                        });
                    }
                    return updateCache({
                        component: loaded,
                        injector: compiledModule.injector,
                        module: compiledModule
                    });
                }

                return updateCache({
                    component: loaded,
                    injector: targetInjector
                });
            });
        }
        return this.cache[selector];
    }

    private handleProviderSolution(): void {

    }

    private isExtSelector(selector: string): boolean {
        return !this.isCoreComponent(selector) && this.isSelectorIncludesExtension(selector);
    }

    private isSelectorIncludesExtension(selector: string): boolean {
        return selector.includes('/');
    }

    private loadModule(selector: string, injector: Injector): any {
        return this.dynamicExtensionLoaderService.loadAndResolve(selector.split('/')[0], injector);
    }

    private isCoreComponent(selector: string): boolean {
        return selector.startsWith('@xm-ngx/');
    }

    private simplifyExtSelector(selector: string): string {
        if (selector.startsWith('ext-')) {
            console.warn(`Deprecated solution! Please, remove 'ext-' from selector '${selector}'`);
            return selector.slice(4);
        }
        return selector;
    }
}
