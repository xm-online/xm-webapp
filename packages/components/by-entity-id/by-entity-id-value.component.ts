import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit } from '@angular/core';
import { EntityCollectionFactoryService } from '@xm-ngx/components/entity-collection';
import { IComponent, IComponentFn } from '@xm-ngx/dynamic';
import { Id } from '@xm-ngx/shared/interfaces';
import { get } from 'lodash';
import { clone } from 'lodash/fp';
import { Subscription } from 'rxjs';

/** Options for {@link ByEntityIdValueComponent.options}. */
export interface ByEntityIdValueOptions {
    /** The entity field key used by {@link ByEntityIdValueComponent } to get a value from the entity. */
    entityField: string;
    /** The resource api is the endpoint from which the entity will be loaded. */
    resourceUrl: string;
}

/** Default component config. */
export const BY_ENTITY_ID_VALUE_OPTIONS: ByEntityIdValueOptions = {
    entityField: 'name',
    resourceUrl: '/entity/api/xm-entities',
};

/**
 * Component loads the entity with the input id and the options,
 * displays a value based on it.
 * @public
 */
@Component({
    selector: 'xm-by-entity-id-value',
    host: { class: 'xm-by-entity-id-value' },
    template: '<span>{{fieldValue}}</span>',
})
export class ByEntityIdValueComponent
    implements IComponent<Id, ByEntityIdValueOptions>, OnInit, OnChanges {

    /** {@inheritDoc IComponent.options} */
    @Input() public options: ByEntityIdValueOptions;
    /** {@inheritDoc IComponent.value} */
    @Input() public value: Id;

    /** The value of the loaded entity. */
    public fieldValue: unknown;

    /** Default options are extending input options. */
    protected defaultOptions: ByEntityIdValueOptions = clone(BY_ENTITY_ID_VALUE_OPTIONS);

    private subsription: Subscription;

    constructor(
        protected factoryService: EntityCollectionFactoryService,
    ) {
    }

    /** {@inheritDoc OnChanges.ngOnChanges} */
    public ngOnChanges(): void {
        this.update();
    }

    /** {@inheritDoc OnInit.ngOnInit} */
    public ngOnInit(): void {
        this.update();
    }

    /**
     * Loads an entity with the {@link ByEntityIdValueComponent.value} id
     * from the {@link ByEntityIdValueComponent.options.resourceUrl} api
     * and get the value from the loaded entity by the {@link ByEntityIdValueComponent.options.entityField} field.
     * @protected
     */
    protected update(): void {
        if (this.value) {
            const resourceUrl = this.options?.resourceUrl || this.defaultOptions.resourceUrl;
            const collection = this.factoryService.create<unknown>(resourceUrl);

            if (this.subsription) {
                this.subsription.unsubscribe();
                delete this.subsription;
            }

            this.subsription = collection.getById(this.value).subscribe((res) =>
                this.fieldValue = this.getEntityField(res.body, this.options?.entityField),
            );
        } else {
            this.fieldValue = '';
        }
    }

    /** Returns the field value from the entity. */
    private getEntityField(entity: unknown, field: string): string {
        return get(entity, field || this.defaultOptions.entityField);
    }
}

@NgModule({
    declarations: [ByEntityIdValueComponent],
    exports: [ByEntityIdValueComponent],
    imports: [CommonModule],
})
export class ByEntityIdValueModule {
    public entry: IComponentFn<Id, ByEntityIdValueOptions> = ByEntityIdValueComponent;
}
