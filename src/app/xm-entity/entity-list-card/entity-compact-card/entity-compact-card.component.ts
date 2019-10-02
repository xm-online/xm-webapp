import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { XmEntity, XmEntitySpec, XmEntitySpecWrapperService } from '../..';
import { CONTAINER_DATA } from '../../shared/tokens';
import { OverlayRef } from '@angular/cdk/overlay';
import { EntityCompactCardOptions } from './enity-compact-card-options.model';
import { FieldOptions } from '../entity-list-card-options.model';
import { getFieldValue } from 'src/app/shared/helpers/entity-list-helper';
import { Principal } from '../../../shared';
import { TranslateService } from '@ngx-translate/core';

declare let $: any;

@Component({
    selector: 'xm-entity-compact-card',
    templateUrl: './entity-compact-card.component.html',
    styleUrls: ['./entity-compact-card.component.scss']
})
export class EntityCompactCardComponent implements OnInit {

    @ViewChild('cardBody', {static: false}) cardBody: ElementRef;

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
        private xmEntitySpecWrapperService: XmEntitySpecWrapperService
    ) { }

    ngOnInit() {
        this.config = this.data.config || {};
        this.entity = this.data.entity || {};
        this.fields = this.config.fields || [];
        this.xmEntitySpecWrapperService.xmSpecByKey(this.entity.typeKey).subscribe(res => this.xmEntitySpec = res || {});

        if (this.isMobileView()) {
            this.overlayRef.overlayElement.classList.add('left');
        }
    }

    getFieldValue(xmEntity: any = {}, field: FieldOptions): any {
        const value = getFieldValue(xmEntity, field);
        if ( typeof  value === 'boolean') {
            return value ? this.translate.instant('global.common.yes') : this.translate.instant('global.common.no');
        }
        return value;
    }

    ngAfterViewInit() {
        this.imageWidth = this.cardBody.nativeElement.offsetWidth;
    }

    close() {
        this.overlayRef.detach();
    }

    isMobileView(): boolean {
        return $(window).width() < 500;
    }



}
