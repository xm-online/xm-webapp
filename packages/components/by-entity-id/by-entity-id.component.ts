import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { EntityCollectionFactoryService } from '@xm-ngx/repositories';
import { Id } from '@xm-ngx/interfaces';
import { Translate } from '@xm-ngx/translation';
import { clone } from 'lodash/fp';
import {
    BY_ENTITY_ID_VALUE_OPTIONS,
    ByEntityIdValueComponent,
    ByEntityIdValueOptions,
} from './by-entity-id-value.component';

/** {@inheritDoc ByEntityIdValueOptions} */
export interface ByEntityIdOptions extends ByEntityIdValueOptions {
    title: Translate;
    styleInline: boolean;
}

/** {@inheritDoc BY_ENTITY_ID_VALUE_OPTIONS} */
export const BY_ENTITY_ID_OPTIONS: ByEntityIdOptions = {
    title: '',
    styleInline: false,
    ...BY_ENTITY_ID_VALUE_OPTIONS,
};

/** {@inheritDoc ByEntityIdValueComponent} */
@Component({
    selector: 'xm-by-entity-id',
    template: `
        <xm-text-view-container [hidden]="!fieldValue" [styleInline]="config?.styleInline">
            <span xmLabel>{{config?.title | translate}}</span>
            <span xmValue>{{fieldValue}}</span>
        </xm-text-view-container>
    `,
})
export class ByEntityIdComponent extends ByEntityIdValueComponent implements OnInit, OnChanges {

    /** {@inheritDoc XmDynamicPresentation.config} */
    @Input() public declare config: ByEntityIdOptions;

    /** {@inheritDoc XmDynamicPresentation.value} */
    @Input() public declare value: Id;

    /** {@inheritDoc ByEntityIdValueComponent.defaultOptions} */
    protected defaultOptions: ByEntityIdOptions = clone(BY_ENTITY_ID_OPTIONS);

    constructor(
        protected factoryService: EntityCollectionFactoryService,
    ) {
        super(factoryService);
    }
}
