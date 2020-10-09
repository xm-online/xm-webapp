import { Compiler, Injectable, NgModuleFactory, NgModuleFactoryLoader, Optional } from '@angular/core';
import { DynamicNgModuleFactory } from '@xm-ngx/dynamic';

@Injectable({ providedIn: 'root'})
export class ModuleLoader {

    constructor(
        @Optional() private compiler: Compiler,
        private loader: NgModuleFactoryLoader,
    ) {
    }

    public async loadModuleFactory<T>(
        moduleImport: Promise<DynamicNgModuleFactory<T>> | DynamicNgModuleFactory<T> | string,
    ): Promise<DynamicNgModuleFactory<T>> {
        let elementModuleOrFactory: DynamicNgModuleFactory<T>;
        if (typeof moduleImport === 'string') {
            elementModuleOrFactory = await this.loader.load(moduleImport);
        } else if (moduleImport instanceof Promise) {
            elementModuleOrFactory = await moduleImport;
        } else {
            elementModuleOrFactory = moduleImport;
        }

        let elModuleFactory: DynamicNgModuleFactory<T>;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elModuleFactory = elementModuleOrFactory;
        } else {
            elModuleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as DynamicNgModuleFactory<T>;
        }

        return elModuleFactory;
    }

}
