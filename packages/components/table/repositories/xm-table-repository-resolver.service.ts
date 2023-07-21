import { Injectable, Injector } from '@angular/core';
import { IEntityCollection, XmRepositoryConfig } from '@xm-ngx/repositories';
import { XmDynamicService, XmDynamicServiceFactory } from '@xm-ngx/dynamic';
import { XmTableConfigController } from '../controllers/config/xm-table-config-controller.service';
import { XmTableWidgetConfig } from '../table-widget/xm-table-widget.config';
import {
    XmTableRepositoryCollectionControllerConfig
} from '../controllers/collections/xm-table-repository-collection-controller.service';

@Injectable()
export class XmTableRepositoryResolver<T> {
    constructor(
        private config: XmTableConfigController<XmTableWidgetConfig>,
        private xmDynamicServiceFactory: XmDynamicServiceFactory,
        private injector: Injector,
    ) {
    }

    public async get(): Promise<IEntityCollection<T>> {
        const repoConfig = (this.config.config.collection as XmTableRepositoryCollectionControllerConfig).repository;
        const repository = await this.xmDynamicServiceFactory
            .findAndFactory<IEntityCollection<T> & XmDynamicService<XmRepositoryConfig>>(repoConfig.selector, this.injector);
        repository.config = repoConfig.config;

        return repository;
    }
}
