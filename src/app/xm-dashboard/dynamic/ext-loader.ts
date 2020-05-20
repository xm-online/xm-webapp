import { Compiler, Injectable, NgModuleFactory, NgModuleFactoryLoader, Optional } from '@angular/core';
import { CNgModuleFactory } from '@xm-ngx/components/dynamic/dynamic-components-base';

@Injectable()
export class ExtLoader {

    constructor(private loader: NgModuleFactoryLoader,
                @Optional() private compiler: Compiler) {
    }

    public async loadModuleFactory<T>(moduleImport: Promise<CNgModuleFactory<T>> | string): Promise<CNgModuleFactory<T>> {
        let elementModuleOrFactory: CNgModuleFactory<T>;
        if (typeof moduleImport === 'string') {
            elementModuleOrFactory = await this.loader.load(moduleImport);
        } else {
            elementModuleOrFactory = await moduleImport;
        }

        let elModuleFactory: CNgModuleFactory<T>;
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            elModuleFactory = elementModuleOrFactory as CNgModuleFactory;
        } else {
            elModuleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory) as CNgModuleFactory;
        }

        return elModuleFactory;
    }

}
