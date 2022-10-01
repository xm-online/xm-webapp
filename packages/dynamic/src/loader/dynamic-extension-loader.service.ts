import { createNgModule, Inject, Injectable, Injector, NgModuleRef } from '@angular/core';

import * as _ from 'lodash';
import { XM_DYNAMIC_EXTENSIONS } from '../dynamic.injectors';
import { XmDynamicExtensionConstructor, XmDynamicExtensionEntry } from '../interfaces/xm-dynamic-extension.model';

@Injectable({
    providedIn: 'root',
})
export class DynamicExtensionLoaderService {

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
        const entry = _.find(_.flatMap(this.dynamicExtensions), i => i.selector == selector) as XmDynamicExtensionEntry<T>;

        if (!entry) {
            return null;
        }
        const moduleCtor: XmDynamicExtensionConstructor<T> = await entry.loadChildren();

        return createNgModule(moduleCtor, injector);
    }
}
