import { Injectable, Injector } from '@angular/core';
import { IEntityCollection, XmRepositoryConfig } from '@xm-ngx/repositories';
import { XmDynamicService, XmDynamicServiceFactory } from '@xm-ngx/dynamic';
import {
    XmTableRepositoryCollectionConfig
} from '../controllers/collections/xm-table-repository-collection-controller.service';

@Injectable()
export class XmTableRepositoryResolver<T> {
    constructor(
        private xmDynamicServiceFactory: XmDynamicServiceFactory,
        private injector: Injector,
    ) {
    }

    public async get(repoConfig: XmTableRepositoryCollectionConfig): Promise<IEntityCollection<T>> {
        const repository = await this.xmDynamicServiceFactory
            .findAndFactory<IEntityCollection<T> & XmDynamicService<XmRepositoryConfig>>(repoConfig.selector, this.injector);
        repository.config = repoConfig.config;

        return repository;
    }
}
