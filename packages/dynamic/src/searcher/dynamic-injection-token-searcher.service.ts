import {Injectable, Injector, NgModuleRef, Type} from '@angular/core';
import {XM_DYNAMIC_ENTRIES} from '../dynamic.injectors';
import {XmDynamicEntries, XmDynamicEntry, XmDynamicEntryType, XmDynamicNgModuleFactory} from '../interfaces';
import {DynamicSearcher} from './dynamic-searcher';
import {flatten} from 'lodash';
import {merge} from 'lodash/fp';

@Injectable({
    providedIn: 'root',
})
export class DynamicInjectionTokenSearcherService implements DynamicSearcher {

    private global: XmDynamicEntries;

    constructor(
        private moduleRef: NgModuleRef<unknown>,
    ) {
        this.global = this.moduleRef.injector.get(XM_DYNAMIC_ENTRIES, []);
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = {injector: this.moduleRef.injector},
        type?: XmDynamicEntryType,
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        // b2b/new-organization
        const component: any = await this.getEntry(selector, options, type) || {loadChildren: () => Promise.resolve(null)};
        return component.loadChildren();
    }

    // getEntry('widget-component', {injector: this.injector})
    public getEntry<T>(
        selector: string,
        options: { injector?: Injector } = {injector: this.moduleRef.injector},
        type?: XmDynamicEntryType,
    ): Promise<XmDynamicEntry<T> | null> {
        const temp = options?.injector?.get(XM_DYNAMIC_ENTRIES, []);
        const components = flatten([...temp, ...this.global]).reduce((acc, v) => merge(acc, v), {});

        // const components = Object.assign({}, ...(options?.injector?.get(XM_DYNAMIC_ENTRIES, {}) || [{}]), ...this.global);

        // console.log(temp);
        if (components[type]?.[selector]) {
            console.warn(`Found a nice component ${selector} with type ${type}`);
        }
        const component: XmDynamicEntry<any> = ((components[type] && components[type][selector]) || components['any'][selector]) as XmDynamicEntry;
        if (!component) {
            console.warn(`cannot find component: ${selector}, type: ${type}`);
        }
        return Promise.resolve(component);
    }
}
