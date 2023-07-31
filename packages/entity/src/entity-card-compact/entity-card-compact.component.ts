import { Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild, SimpleChanges } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { JsfAttributes } from '@xm-ngx/json-schema-form';
import { XmToasterService } from '@xm-ngx/toaster';
import { finalize, take } from 'rxjs/operators';
import { Principal } from '@xm-ngx/core/user';
import { nullSafe } from '@xm-ngx/json-schema-form/components';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { RatingListSectionComponent } from '../rating-list-section/rating-list-section.component';
import { XmEntityService } from '@xm-ngx/core/entity';

/**
 *
 * @privateRemarks
 * transferred from entity-detail-fab
 */
import { EntityDetailDisplayMode, EntityUiConfig } from '@xm-ngx/core/config';
import { EntityDetailDialogComponent } from '../entity-detail-dialog/entity-detail-dialog.component';

import { JsfComponentRegistryService } from '@xm-ngx/json-schema-form/components';
import { Location } from '@angular/common';
import { XmAlertService } from '@xm-ngx/alert';

@Component({
    selector: 'xm-entity-card-compact',
    templateUrl: './entity-card-compact.component.html',
    styleUrls: ['./entity-card-compact.component.scss'],
})
export class EntityCardCompactComponent extends EntityCardComponent implements OnInit, OnChanges {

    @ViewChild('rating', {static: false}) public rating: RatingListSectionComponent;

    @Input() public navBackEnabled?: boolean;
    @Input() public displayMode?: EntityDetailDisplayMode = 'BOTH';
    @Input() public preventDefaultUpdateError?: boolean;
    @Input() public entityUiConfig: EntityUiConfig;
    @Output() public saveError: EventEmitter<boolean> = new EventEmitter<boolean>();

    public jsfAttributes: JsfAttributes;
    public showLoader: boolean;
    public isDescFull: boolean;

    // transferred from entity-detail-fab
    public showEditButton: boolean;
    public showEditOptions: boolean = false;
    public showEditSubOptions: boolean = false;

    constructor(
        protected modalService: MatDialog,
        protected principal: Principal,
        private alertService: XmAlertService,
        private toasterService: XmToasterService,
        protected eventManager: XmEventManager,
        protected translateService: TranslateService,
        protected xmEntityService: XmEntityService,
        protected widgetService: JsfComponentRegistryService,
        private location: Location,
    ) {
        super(modalService, principal, eventManager);
    }

    public onBack(): void {
        this.location.back();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.loadJsfAttr();
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.showEditButton = true;

        const currentKey = changes?.xmEntitySpec?.currentValue.key;
        const uiConfigKey = this.entityUiConfig && this.entityUiConfig.typeKey;

        if (currentKey && uiConfigKey && currentKey === uiConfigKey) {
            this.checkEntityEditPermission(this.entityUiConfig);
        }
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    private checkEntityEditPermission(config: EntityUiConfig): void {
        if (config.editButtonPermission) {
            this.showEditButton = false;
            this.principal.hasPrivileges([config.editButtonPermission]).then((result) => {
                if (result) {
                    this.showEditButton = true;
                }
            });
        }
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public onEdit(): void {
        this.openDialog(EntityDetailDialogComponent, (modalRef) => {
            modalRef.componentInstance.xmEntity = Object.assign({}, this.xmEntity);
            modalRef.componentInstance.xmEntitySpec = this.xmEntitySpec;
        });
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    private openDialog(dialogClass: any, operation: any, options?: any): MatDialogRef<any> {
        const modalRef = this.modalService.open<any>(dialogClass, options ? options : {width: '500px'});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    /**
     *
     * @privateRemarks
     * transferred from entity-detail-fab
     */
    public xmEditContext(): () => boolean {
        return () => {
            // this flag turns off
            this.showEditOptions = true;
            return this.showEditOptions;
        };
    }


    public onSubmitForm(data: any): void {
        this.showLoader = true;
        this.xmEntity.data = Object.assign({}, data);
        this.xmEntityService.update(this.xmEntity).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.eventManager.broadcast({name: 'xmEntityDetailModification', content: {entity: res.body}});
                    this.xmEntity = Object.assign(this.xmEntity, res.body);
                    this.toasterService.success('xm-entity.entity-data-card.update-success');
                },
                (err) => {
                    if (!this.preventDefaultUpdateError) {
                        this.toasterService.error('xm-entity.entity-data-card.update-error');
                    } else {
                        this.saveError.emit(err);
                    }
                },
            );
    }

    public rebuildForm(): void {
        this.loadJsfAttr();
    }

    protected loadJsfAttr(): void {
        if (this.xmEntitySpec && this.xmEntitySpec.dataSpec) {
            this.jsfAttributes = this.widgetService.buildJsfAttributes(this.xmEntitySpec.dataSpec, this.xmEntitySpec.dataForm);
            this.jsfAttributes.data = Object.assign(nullSafe(this.jsfAttributes.data), nullSafe(this.xmEntity.data));
        }
    }

    protected alert(type: string, key: string): void {
        this.alertService.open({
            type,
            text: this.translateService.instant(key),
        }).pipe(take(1)).subscribe();
    }

}
