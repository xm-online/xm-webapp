import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import {XmDynamicEntry, XmDynamicEntryType, XmDynamicNgModuleFactory} from '../interfaces';
import { DynamicInjectionTokenSearcherService } from './dynamic-injection-token-searcher.service';
import { DynamicInjectorSearcherService } from './dynamic-injector-searcher.service';
import { DynamicSearcher } from './dynamic-searcher';

@Injectable({
    providedIn: 'root',
})
export class DynamicMultiSearcherService implements DynamicSearcher {

    constructor(
        private moduleRef: NgModuleRef<unknown>,
        private dynamicInjectionTokenSearcherService: DynamicInjectionTokenSearcherService,
        private dynamicInjectorSearcherService: DynamicInjectorSearcherService,
    ) {
    }

    public async search<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
        type?: XmDynamicEntryType,
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        return await this.dynamicInjectorSearcherService.search(selector, options)
            || await this.dynamicInjectionTokenSearcherService.search(selector, options, type);
    }

    public async getEntry<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
        type?: XmDynamicEntryType,
    ): Promise<XmDynamicEntry<T> | null> {
        return await this.dynamicInjectorSearcherService.getEntry(selector, options, type)
            || await this.dynamicInjectionTokenSearcherService.getEntry(selector, options, type);
    }
}
