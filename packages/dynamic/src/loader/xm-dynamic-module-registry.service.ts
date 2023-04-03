import { createNgModule, Inject, Injectable, Injector, NgModuleRef } from '@angular/core';
import { Dictionary, filter, find, flatten, keyBy, uniqBy } from 'lodash';

import { XM_DYNAMIC_EXTENSIONS } from '../dynamic.injectors';
import { XmDynamicExtensionEntry } from '../interfaces/xm-dynamic-extension.model';
import { NotFoundException } from '@xm-ngx/shared/exceptions';

@Injectable()
export class XmDynamicModuleRegistry {

    private cache: { [moduleSelector: string]: Promise<NgModuleRef<unknown>> } = {};

    private readonly dynamicExtensionsMap: Dictionary<XmDynamicExtensionEntry>;

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        @Inject(XM_DYNAMIC_EXTENSIONS) dynamicExtensions: XmDynamicExtensionEntry[][],
    ) {
        const flattened = flatten(dynamicExtensions);

        const duplicates = filter(flattened, (o, i) =>
            find(flattened, (e) => e.selector == o.selector, i + 1)
        ) as XmDynamicExtensionEntry[];
        // eslint-disable-next-line no-console
        duplicates.forEach(i => console.error(`Module with the same selector=${i.selector}.`));
        const uniqued = uniqBy(flattened, 'selector');
        this.dynamicExtensionsMap = keyBy(uniqued, 'selector');
    }

    public contains(selector: string): boolean {
        return this.dynamicExtensionsMap[selector] != null;
    }

    /**
     *
     * @throws NotFoundException
     */
    public find<T>(
        selector: string,
        injector: Injector = this.moduleRef.injector,
    ): Promise<NgModuleRef<T>> {
        // TODO: Components are being resolved in any context and cannot be cached
        // if (this.cache[selector]) {
        //     return this.cache[selector] as Promise<NgModuleRef<T>>;
        // }

        const entry = this.dynamicExtensionsMap[selector];
        if (!entry) {
            throw new NotFoundException(`
            The module selector='${selector}' is not declared!
            Use XmDynamicExtensionModule.forRoot(...) or .forChild(...).`);
        }

        this.cache[selector] = entry.loadChildren().then(moduleConstructor => {
            return createNgModule(moduleConstructor, injector);
        });

        return this.cache[selector] as Promise<NgModuleRef<T>>;
    }
}
