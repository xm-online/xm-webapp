import { createNgModule, Inject, Injectable, Injector, NgModuleRef } from '@angular/core';

import * as _ from 'lodash';
import { XM_DYNAMIC_EXTENSIONS } from '../dynamic.injectors';
import { XmDynamicExtensionEntry } from '../interfaces/xm-dynamic-extension.model';

@Injectable({
    providedIn: 'root',
})
export class DynamicModulesService {

    private cache: any = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        @Inject(XM_DYNAMIC_EXTENSIONS) private dynamicExtensions: Record<string, XmDynamicExtensionEntry>[],
    ) {
    }

    public async loadAndResolve<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<NgModuleRef<T> | null> {
        if (!selector || typeof selector !== 'string') {
            return null;
        }
        if (!this.cache[selector]) {
            const entry = Object.assign({}, ...this.dynamicExtensions)[selector];

            if (!entry) {
                return null;
            }
            this.cache[selector] = new Promise((resolve, reject) => {
                entry.loadChildren().then(moduleConstructor => {
                    console.log('ready to create module: ', selector);
                    const module = createNgModule(moduleConstructor, injector);
                    this.cache[selector] = module;
                    resolve(module);
                }).catch(err => reject(err));
            });
        } else if (this.cache[selector] instanceof Promise) {
            return await this.cache[selector];
        }
        return this.cache[selector];
    }
}
