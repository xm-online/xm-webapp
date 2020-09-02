import { Component, Input, OnChanges } from '@angular/core';
import { EntityCollectionFactoryService, Id } from '@xm-ngx/components/entity-collection';
import { Translate } from '@xm-ngx/translation';
import { get } from 'lodash';
import { clone } from 'lodash/fp';

interface ByEntityIdOptions {
    title: Translate;
    fieldWithId: string;
    entityField: string;
    resourceUrl: string;
    styleInline: boolean;
}

const BY_ENTITY_ID_OPTIONS: ByEntityIdOptions = {
    title: '',
    fieldWithId: 'id',
    entityField: 'name',
    styleInline: false,
    resourceUrl: '/entity/api/xm-entities',
};

@Component({
    selector: 'xm-by-entity-id',
    template: `
        <xm-text [hidden]="!fieldValue" [styleInline]="options?.styleInline">
            <span xmLabel>{{options?.title | translate}}</span>

            <span xmValue>{{fieldValue}}</span>
        </xm-text>
    `,
})
export class ByEntityIdComponent implements OnChanges {

    @Input() public options: ByEntityIdOptions;
    @Input() public value: Id;
    public fieldValue: unknown;
    protected defaultOptions: ByEntityIdOptions = clone(BY_ENTITY_ID_OPTIONS);

    constructor(
        private factoryService: EntityCollectionFactoryService,
    ) {
    }

    public ngOnChanges(): void {
        this.update();
    }

    public ngOnInit(): void {
        this.update();
    }

    private update(): void {
        if (this.value) {
            const resourceUrl = this.options?.resourceUrl || this.defaultOptions.resourceUrl;
            const collection = this.factoryService.create<unknown>(resourceUrl);
            collection.getById(this.value)
                .subscribe((res) => this.fieldValue = get(res.body, this.options?.entityField || this.defaultOptions.entityField));
        }
    }
}
