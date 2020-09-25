import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnChanges, OnInit, Type } from '@angular/core';
import { EntityCollectionFactoryService, Id } from '@xm-ngx/components/entity-collection';
import { get } from 'lodash';
import { clone } from 'lodash/fp';

export interface ByEntityIdCellOptions {
    fieldWithId: string;
    entityField: string;
    resourceUrl: string;
    styleInline: boolean;
}

export const BY_ENTITY_ID_CELL_OPTIONS: ByEntityIdCellOptions = {
    fieldWithId: 'id',
    entityField: 'name',
    styleInline: false,
    resourceUrl: '/entity/api/xm-entities',
};

@Component({
    selector: 'xm-by-entity-id-value',
    template: `
        <span>{{fieldValue}}</span>
    `,
})
export class ByEntityIdCellComponent implements OnInit, OnChanges {

    @Input() public options: ByEntityIdCellOptions;
    @Input() public value: Id;
    public fieldValue: unknown;
    protected defaultOptions: ByEntityIdCellOptions = clone(BY_ENTITY_ID_CELL_OPTIONS);

    constructor(
        protected factoryService: EntityCollectionFactoryService,
    ) {
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }

    protected update(): void {
        if (this.value) {
            const resourceUrl = this.options?.resourceUrl || this.defaultOptions.resourceUrl;
            const collection = this.factoryService.create<unknown>(resourceUrl);
            collection.getById(this.value)
                .subscribe((res) => this.fieldValue = get(res.body, this.options?.entityField || this.defaultOptions.entityField));
        }
    }
}

@NgModule({
    declarations: [ByEntityIdCellComponent],
    exports: [ByEntityIdCellComponent],
    imports: [
        CommonModule,
    ],
})
export class ByEntityIdCellModule {
    public entry: Type<ByEntityIdCellComponent> = ByEntityIdCellComponent;
}
