import { createNgModule, Inject, Injectable, Injector, NgModuleRef } from '@angular/core';

import * as _ from 'lodash';
import { XM_DYNAMIC_EXTENSIONS } from '../dynamic.injectors';
import { XmDynamicExtensionConstructor, XmDynamicExtensionEntry } from '../interfaces/xm-dynamic-extension.model';

@Injectable({
    providedIn: 'root',
})
export class DynamicExtensionLoaderService {

    private cache: any = {};

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        @Inject(XM_DYNAMIC_EXTENSIONS) private dynamicExtensions: XmDynamicExtensionEntry[],
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
            const entry = _.find(_.flatMap(this.dynamicExtensions), i => i.selector == selector) as XmDynamicExtensionEntry<T>;

            if (!entry) {
                return null;
            }
            const moduleCtor: XmDynamicExtensionConstructor<T> = await entry.loadChildren();

            console.log('ready to create module', selector);
            const module = createNgModule(moduleCtor, injector);
            this.cache[selector] = module;
        }
        return this.cache[selector];
    }
}
