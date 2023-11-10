import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { Subscription } from 'rxjs';

import { I18nNamePipe } from '@xm-ngx/translation';
import { Principal } from '@xm-ngx/core/user';
import { FunctionCallDialogComponent, FunctionService, XmEntity, XmEntityService } from '@xm-ngx/entity';
import { XmDynamicWidget } from '@xm-ngx/dynamic';

const XM_FUNCTION_CALL_SUCCESS = 'xm.functionCall.success';

@Component({
    selector: 'xm-available-offerings-widget',
    templateUrl: './available-offerings-widget.component.html',
    styleUrls: ['./available-offerings-widget.component.scss'],
})
export class AvailableOfferingsWidgetComponent implements OnInit, OnDestroy, XmDynamicWidget {

    @Input() public config: any;
    public offerings: any[];
    public rowSize: number;
    public rows: any[];
    public noOfferings: boolean = false;
    private availableOfferingActionSuccessSubscription: Subscription;

    constructor(private principal: Principal,
                private eventManager: XmEventManager,
                private xmEntityService: XmEntityService,
                private functionService: FunctionService,
                private modalService: MatDialog,
                private translateService: TranslateService,
                private i18nNamePipe: I18nNamePipe) {
    }

    public ngOnInit(): void {
        this.rowSize = this.config.rowSize ? this.config.rowSize : 3;
        this.load();
        this.availableOfferingActionSuccessSubscription = this.eventManager
            .subscribe(XM_FUNCTION_CALL_SUCCESS,
                () => this.load());
    }

    public ngOnDestroy(): void {
        if (this.availableOfferingActionSuccessSubscription) {
            this.eventManager.destroy(this.availableOfferingActionSuccessSubscription);
        }
    }

    public load(): void {
        if (this.config.query) {
            this.xmEntityService.search({query: this.config.query}).subscribe(
                (resp: HttpResponse<XmEntity[]>) => {
                    this.offerings = resp.body;
                    this.rows = Array.from(Array(Math.ceil(this.offerings.length / this.rowSize)).keys());
                },
                () => {
                    this.noOfferings = true;
                });
        } else if (this.config.functionKey) {
            this.functionService.call(this.config.functionKey, {}).subscribe(
                (resp: HttpResponse<any>) => {
                    this.offerings = resp.body.data.data;
                    this.rows = Array.from(Array(Math.ceil(this.offerings.length / this.rowSize)).keys());
                },
                () => {
                    this.noOfferings = true;
                });
        }
    }

    public resolveAvatarUrl(offering: any): string {
        if (offering && offering.avatarUrl && !offering.avatarUrl.startsWith('http')) {
            return 'https://xm-avatar-rgw.icthh.com/' + offering.avatarUrl;
        }
        return offering ? offering.avatarUrl : null;
    }

    public onAction(offering: any): void {
        const modalRef = this.modalService.open(FunctionCallDialogComponent, {width: '500px'});
        modalRef.componentInstance.xmEntity = offering;
        modalRef.componentInstance.functionSpec = {key: this.config.action.functionKey};
        this.translateService.get('ext-common-entity.available-offerings-widget.action-dialog.question', {
            action: this.i18nNamePipe.transform(this.config.action.name, this.principal),
            name: offering.name,
        }).subscribe((result) => {
            modalRef.componentInstance.dialogTitle = result;
        });
        modalRef.componentInstance.buttonTitle = this.config.action.name;
    }

}
