import { ComponentFactory, Injectable, Injector, NgModuleFactory, NgModuleRef, Type } from '@angular/core';

import { DynamicNgModuleFactory, IDynamicModule } from '../dynamic.interfaces';
import { DynamicSearcher } from '../searcher/dynamic-searcher';
import { DynamicLoaderService, isComponentDef, isModuleDef } from './dynamic-loader.service';

@Injectable({
    providedIn: 'root',
})
export class DynamicTenantLoaderService {

    constructor(
        private loaderService: DynamicLoaderService,
        private dynamicSearcher: DynamicSearcher,
        private moduleRef: NgModuleRef<unknown>,
    ) {
    }

    public async load<T>(selector: string): Promise<Type<T> | null> {
        return (await this.loadAndResolve(selector)).componentType;
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<ComponentFactory<T> | null> {
        const moduleSelector = selector.split('/')[0];
        const moduleRef = await this.loadTenantModuleRef<T>(moduleSelector, injector);
        const componentSelector = selector.split('/')[1];
        return await this.getComponentFromInjector<T>(componentSelector, moduleRef);
    }

    /**
     * @param selector e.g. ext-entity
     * @param injector
     */
    public async loadTenantModuleRef<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<NgModuleRef<IDynamicModule<T>> | null> {
        if (!selector || typeof selector !== 'string') {
            return null;
        }

        const moduleFactoryRef = await this.loadTenantModuleFactory<T>(selector);
        return moduleFactoryRef.create(injector);
    }

    /**
     * @param selector e.g. my-example-widget
     * @param moduleRef
     */
    public async getComponentFromInjector<T>(
        selector: string,
        moduleRef: NgModuleRef<IDynamicModule<T>>,
    ): Promise<ComponentFactory<T> | null> {
        const moduleFac = await this.dynamicSearcher.search(selector, {injector: moduleRef.injector});

        if (moduleFac instanceof NgModuleFactory || isModuleDef(moduleFac)) {
            const moduleFactory = await this.loaderService.loadModuleFactory<T>(moduleFac as DynamicNgModuleFactory<T>);
            return this.getComponentFromModuleAndResolve(moduleFactory, moduleRef.injector);
        } else if (isComponentDef(moduleFac)) {
            return moduleRef.componentFactoryResolver.resolveComponentFactory(moduleFac as Type<T>);
        } else {
            return null;
        }
    }

    public getComponentFromModuleAndResolve<T>(
        moduleFactory: DynamicNgModuleFactory<T>,
        injector: Injector = this.moduleRef.injector,
    ): ComponentFactory<T> {
        const elementModuleRef = moduleFactory.create(injector);

        if (!elementModuleRef.instance.entry) {
            throw new Error(`ERROR: the "${moduleFactory.moduleType}" module expected to have `
                + 'a "entry" field!'
                + 'E.g. class MyModule{ entry = YourComponent; }');
        }

        return elementModuleRef.componentFactoryResolver.resolveComponentFactory(elementModuleRef.instance.entry);
    }

    public loadTenantModuleFactory<T>(selector: string): Promise<DynamicNgModuleFactory<T>> {
        const modulePath = this.resolveTenantModulePath(selector);
        return this.loaderService.loadModuleFactory(modulePath);
    }

    public resolveTenantModulePath(module: string): string {
        const commons: string[] = ['ext-common', 'ext-common-csp', 'ext-common-entity'];

        const rootClass = module.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('');
        const extName = module.split('-').reverse()[0];
        const extRootClass = `${extName.charAt(0).toUpperCase() + extName.slice(1)}WebappExtModule`;
        let modulePath: string;
        if (commons.includes(module)) {
            modulePath = `src/app/ext-commons/${module}/${module}.module#${rootClass}Module`;
        } else {
            modulePath = `src/app/ext/${extName}-webapp-ext/module/${extName}-webapp-ext.module#${extRootClass}`;
        }

        return modulePath;
    }

}
