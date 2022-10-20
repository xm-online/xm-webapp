import { Compiler, Injectable, NgModuleFactory, Optional } from '@angular/core';
import { XmDynamicNgModuleFactory } from '../interfaces';

@Injectable({ providedIn: 'root'})
export class ModuleLoader {

    constructor(
        @Optional() private compiler: Compiler,
    ) {

    }

    public async loadModuleFactory<T>(
        moduleImport: Promise<XmDynamicNgModuleFactory<T>> | XmDynamicNgModuleFactory<T>,
    ): Promise<XmDynamicNgModuleFactory<T>> {
        let elementModuleOrFactory: XmDynamicNgModuleFactory<T>;
        if (moduleImport instanceof Promise) {
            elementModuleOrFactory = await moduleImport;
        } else {
            elementModuleOrFactory = moduleImport;
        }

        let elModuleFactory: XmDynamicNgModuleFactory<T>;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elModuleFactory = elementModuleOrFactory;
        } else {
            elModuleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as XmDynamicNgModuleFactory<T>;
            this.compiler.clearCacheFor(elementModuleOrFactory);
        }

        return elModuleFactory;
    }

}
