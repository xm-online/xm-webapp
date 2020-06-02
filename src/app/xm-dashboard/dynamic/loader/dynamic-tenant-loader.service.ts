import { ComponentFactory, Injectable, Injector, NgModuleFactory, NgModuleRef, Type } from '@angular/core';

import { DynamicLoaderService, isComponentDef, isModuleDef } from './dynamic-loader.service';
import { DynamicNgModuleFactory, IDynamicModule } from '../dynamic.interfaces';
import { DynamicSearcher } from '../searcher/dynamic-searcher';

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
        const moduleSelector = selector.split('/')[0];
        const moduleRef = await this.loadTenantModuleRef(moduleSelector);
        const componentSelector = selector.split('/')[1];
        return await this.getComponentFromInjector(componentSelector, moduleRef.injector);
    }

    public async loadAndResolve<T>(selector: string): Promise<ComponentFactory<T> | null> {
        const moduleSelector = selector.split('/')[0];
        const moduleRef = await this.loadTenantModuleRef(moduleSelector);
        const componentSelector = selector.split('/')[1];
        const componentRef = await this.getComponentFromInjector<T>(componentSelector, moduleRef.injector);
        return moduleRef.componentFactoryResolver.resolveComponentFactory(componentRef);
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

        if (!selector.startsWith('ext-')) {
            console.warn('ERROR: The selector must starts with "ext-"');
            return null;
        }

        const moduleFactoryRef = await this.loadTenantModuleFactory<T>(selector);
        return moduleFactoryRef.create(injector);
    }

    /**
     * @param selector e.g. my-example-widget
     * @param injector
     */
    public async getComponentFromInjector<T>(
        selector: string,
        injector: Injector,
    ): Promise<Type<T> | null> {
        const moduleFac = await this.dynamicSearcher.search(selector, {injector});

        if (moduleFac instanceof NgModuleFactory || isModuleDef(moduleFac)) {
            const moduleFactory = await this.loaderService.loadModuleFactory<T>(moduleFac as DynamicNgModuleFactory<T>);
            return this.loaderService.getComponentFromModule(moduleFactory, injector);
        } else if (isComponentDef(moduleFac)) {
            return moduleFac as Type<T>;
        } else {
            return null;
        }
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
