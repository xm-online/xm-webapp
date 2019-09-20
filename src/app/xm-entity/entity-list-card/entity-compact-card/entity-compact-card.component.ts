import { Component, Inject, Input, OnInit } from '@angular/core';
import { XmEntity } from '../..';
import { CONTAINER_DATA } from '../../shared/tokens';
import { OverlayRef } from '@angular/cdk/overlay';
import { EntityCompactCardOptions } from './enity-compact-card-options.model';
import { FieldOptions } from '../entity-list-card-options.model';
import { getFieldValue } from 'src/app/shared/helpers/entity-list-helper';
import { Principal } from '../../../shared';

@Component({
    selector: 'xm-entity-compact-card',
    templateUrl: './entity-compact-card.component.html',
    styleUrls: ['./entity-compact-card.component.scss']
})
export class EntityCompactCardComponent implements OnInit {

    private config: EntityCompactCardOptions;

    public entity: XmEntity;
    public fields: any;

    constructor(
        @Inject(CONTAINER_DATA) public data: any,
        public overlayRef: OverlayRef,
        public principal: Principal
    ) { }

    ngOnInit() {
        console.log(this);
        this.config = this.data.config || {};
        this.entity = this.data.entity || {};
        this.fields = this.config.fields || [];
    }

    getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        return getFieldValue(xmEntity, field);
    }

    close() {
        this.overlayRef.detach();
    }

}
