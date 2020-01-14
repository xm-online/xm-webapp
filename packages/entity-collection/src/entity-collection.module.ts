import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import * as _ from 'lodash';
import { EntityCollectionFactoryService } from './entity-collection/entity-collection-factory.service';
import { ENTITY_COLLECTION_CONFIG } from './injectors';
import { ENTITY_COLLECTION_CONFIG_DEFAULT, EntityCollectionConfig } from './models';

export function configFactory(config: EntityCollectionConfig): EntityCollectionConfig {
    return _.defaults(config, ENTITY_COLLECTION_CONFIG_DEFAULT);
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
})
export class EntityCollectionModule {
    public static forRoot(config: EntityCollectionConfig): ModuleWithProviders {
        return {
            ngModule: EntityCollectionModule,
            providers: [
                EntityCollectionFactoryService,
                {provide: ENTITY_COLLECTION_CONFIG, useFactory: configFactory, deps: [config]},
            ],
        };
    }
}
