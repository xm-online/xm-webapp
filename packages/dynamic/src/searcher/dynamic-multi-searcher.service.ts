import { Injectable, Injector, NgModuleRef, Type } from '@angular/core';
import { XmDynamicEntry, XmDynamicNgModuleFactory } from '../interfaces';
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
    ): Promise<XmDynamicNgModuleFactory<T> | Type<T> | null> {
        return await this.dynamicInjectorSearcherService.search(selector, options)
            || await this.dynamicInjectionTokenSearcherService.search(selector, options);
    }

    public async getEntry<T>(
        selector: string,
        options: { injector?: Injector } = { injector: this.moduleRef.injector },
    ): Promise<XmDynamicEntry<T> | null> {
        return await this.dynamicInjectorSearcherService.getEntry(selector, options)
            || await this.dynamicInjectionTokenSearcherService.getEntry(selector, options);
    }
}
