import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { getFieldValue } from 'src/app/shared/helpers/entity-list-helper';
import { Principal } from '../../../shared';
import { CONTAINER_DATA } from '../../shared/tokens';
import { XmEntitySpecWrapperService } from '../../shared/xm-entity-spec-wrapper.service';
import { XmEntitySpec } from '../../shared/xm-entity-spec.model';
import { XmEntity } from '../../shared/xm-entity.model';
import { FieldOptions } from '../entity-list-card-options.model';
import { EntityCompactCardOptions } from './enity-compact-card-options.model';

declare let $: any;

@Component({
    selector: 'xm-entity-compact-card',
    templateUrl: './entity-compact-card.component.html',
    styleUrls: ['./entity-compact-card.component.scss'],
})
export class EntityCompactCardComponent implements OnInit {

    @ViewChild('cardBody', {static: false}) public cardBody: ElementRef;

    private config: EntityCompactCardOptions;

    public entity: XmEntity;
    public fields: any;
    public imageWidth: string;
    public xmEntitySpec: XmEntitySpec;

    constructor(
        @Inject(CONTAINER_DATA) public data: any,
        public overlayRef: OverlayRef,
        public principal: Principal,
        public translate: TranslateService,
        private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
    ) { }

    public ngOnInit() {
        this.config = this.data.config || {};
        this.entity = this.data.entity || {};
        this.fields = this.config.fields || [];
        this.xmEntitySpecWrapperService.xmSpecByKey(this.entity.typeKey).subscribe((res) => this.xmEntitySpec = res || {});

        if (this.isMobileView()) {
            this.overlayRef.overlayElement.classList.add('left');
        }
    }

    public getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        const value = getFieldValue(xmEntity, field);
        if ( typeof  value === 'boolean') {
            return value ? this.translate.instant('global.common.yes') : this.translate.instant('global.common.no');
        }
        return value;
    }

    public ngAfterViewInit() {
        this.imageWidth = this.cardBody.nativeElement.offsetWidth;
    }

    public close() {
        this.overlayRef.detach();
    }

    public isMobileView(): boolean {
        return $(window).width() < 500;
    }

}
