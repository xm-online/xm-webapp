import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import * as _ from 'lodash';
import { XM_DYNAMIC_ENTRIES } from '../dynamic.injectors';
import { XmDynamicEntries, XmDynamicEntry, XmDynamicNgModuleFactory } from '../interfaces';
import { DynamicSearcher } from './dynamic-searcher';

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
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        const component = await this.getEntry(selector, options) || { loadChildren: () => Promise.resolve(null) };
        return component.loadChildren();
    }

    // getEntry('widget-component', {injector: this.injector})
    public getEntry<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
        type?: string, // 'control'
    ): Promise<XmDynamicEntry<T> | null> {
        const temp = options.injector.get(XM_DYNAMIC_ENTRIES, {});
        const components = Object.assign({}, ...temp);
        const component = (components[type] && components[type][selector]) || components['any'][selector];
        if(!component) {
            console.warn(`cannot find component: ${selector}, type: ${type}`);
        }
        if(component && type){
            alert(`ЄЄЄЄЄ!!!!! ${type}`);
        }
        return Promise.resolve(component);
    }

    public getAllEntries<T>(selector: string, options?: { injector?: Injector }): XmDynamicEntry<T>[] {
        const providers = options.injector.get(XM_DYNAMIC_ENTRIES, []);
        return _.flatMap<XmDynamicEntry<T>>([...providers, ...this.global] as XmDynamicEntry<T>[]);
    }
}
