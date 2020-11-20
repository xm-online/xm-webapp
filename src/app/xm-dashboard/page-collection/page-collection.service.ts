import { Injectable, OnDestroy } from '@angular/core';
import { EntityCollectionBase, EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { Page, PageService } from '@xm-ngx/dashboard';
import { IId } from '@xm-ngx/shared/interfaces';
import { takeUntilOnDestroy, takeUntilOnDestroyDestroy } from '@xm-ngx/shared/operators';
import { PageCollectionConfig } from './page-collection-config';

export interface PageCollectionPageConfig {
    resourceUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class PageCollectionService<T extends IId = unknown> extends EntityCollectionBase<T> implements OnDestroy {

    constructor(
        private collectionConfig: PageCollectionConfig,
        private pageService: PageService<Page<PageCollectionPageConfig>>,
        private factoryService: EntityCollectionFactoryService,
    ) {
        super(factoryService.create<T>(collectionConfig.defaultResourceUrl));
        this.init();
    }

    public init(): void {
        this.pageService.active$().pipe(
            takeUntilOnDestroy(this),
        ).subscribe((res) => {
            const resourceUrl = res?.config?.resourceUrl || this.collectionConfig.defaultResourceUrl;
            const collection = this.factoryService.create<T>(resourceUrl);
            this.setCollection(collection);
        });
    }

    public ngOnDestroy(): void {
        takeUntilOnDestroyDestroy(this);
    }
}
