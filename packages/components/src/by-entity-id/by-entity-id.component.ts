import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
    BY_ENTITY_ID_CELL_OPTIONS,
    ByEntityIdCellComponent,
    ByEntityIdCellOptions,
} from '@xm-ngx/components/by-entity-id/by-entity-id-cell.component';
import { EntityCollectionFactoryService, Id } from '@xm-ngx/components/entity-collection';
import { Translate } from '@xm-ngx/translation';
import { clone } from 'lodash/fp';

interface ByEntityIdOptions extends ByEntityIdCellOptions {
    title: Translate;
}

const BY_ENTITY_ID_OPTIONS: ByEntityIdOptions = {
    title: '',
    ...BY_ENTITY_ID_CELL_OPTIONS
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
export class ByEntityIdComponent extends ByEntityIdCellComponent implements OnInit, OnChanges {
    @Input() public options: ByEntityIdOptions;
    @Input() public value: Id;
    public fieldValue: unknown;
    protected defaultOptions: ByEntityIdOptions = clone(BY_ENTITY_ID_OPTIONS);

    constructor(
        protected factoryService: EntityCollectionFactoryService,
    ) {
        super(factoryService);
    }

    public ngOnChanges(): void {
        super.ngOnChanges();
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }
}
